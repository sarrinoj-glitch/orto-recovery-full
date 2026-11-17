<?php
// Заявка с сайта: проверка полей и отправка администратору центра.
// Каналы (любой набор, настраивается в config.php → 'lead'):
//   green_*         — основной: WhatsApp центра через Green API (тариф «Разработчик» бесплатный, до 3 чатов);
//   email           — почта клиники через mail() хостинга;
//   telegram_chats  — чаты администраторов в Telegram через бота центра.
if (!defined('ORTO')) { http_response_code(404); exit; }

const LEAD_WHEN = ['До двух недель', 'От месяца до полугода', 'Больше полугода'];
const LEAD_WHY = ['Да, травма', 'Да, операция', 'Нет'];

function lead_clean($v, $max)
{
    $s = is_scalar($v) ? (string)$v : '';
    $s = preg_replace('/[\x00-\x1F\x7F]/u', ' ', $s);
    return mb_substr(trim((string)$s), 0, $max, 'UTF-8');
}

// Возвращает [ошибка|null, текст заявки|null]. 'spam' — сработала ловушка для ботов.
function lead_validate($b)
{
    if (!is_array($b)) return ['body', null];
    if (!empty($b['company'])) return ['spam', null];
    $name = lead_clean(isset($b['name']) ? $b['name'] : '', 80);
    $phone = lead_clean(isset($b['phone']) ? $b['phone'] : '', 30);
    $digits = preg_replace('/\D/', '', $phone);
    $what = lead_clean(isset($b['what']) ? $b['what'] : '', 1000);
    $when = (isset($b['when']) && in_array($b['when'], LEAD_WHEN, true)) ? $b['when'] : '';
    $why = (isset($b['why']) && in_array($b['why'], LEAD_WHY, true)) ? $b['why'] : '';
    $page = lead_clean(isset($b['page']) ? $b['page'] : '', 200);
    if (mb_strlen($name, 'UTF-8') < 2 || strlen($digits) < 10 || strlen($digits) > 12 || !isset($b['consent']) || $b['consent'] !== true) {
        return ['validation', null];
    }
    $lines = ['Заявка на приём с сайта', "Имя: $name", "Телефон: $phone"];
    if ($what !== '') $lines[] = "Что беспокоит: $what";
    if ($when !== '') $lines[] = "Как давно: $when";
    if ($why !== '') $lines[] = "Травма или операция: $why";
    if ($page !== '') $lines[] = "Страница: $page";
    return [null, implode("\n", $lines)];
}

// Не больше 5 заявок с одного IP за 10 минут
function lead_rate_limited($ip)
{
    if (!is_dir(PRIV)) return false;
    $rel = 'rate/' . md5($ip) . '.json';
    $now = time();
    $hits = array_values(array_filter((array)jread($rel, []), function ($t) use ($now) { return $now - (int)$t < 600; }));
    $hits[] = $now;
    jwrite($rel, $hits);
    return count($hits) > 5;
}

// Возвращает: 'sent' — ушла хотя бы в один канал, 'failed' — каналы есть, но ни один не ответил, 'none' — каналы не настроены
function lead_send($text)
{
    $c = cfg('lead');
    if (!is_array($c)) return 'none';
    $tried = 0;
    $ok = 0;

    if (!empty($c['email'])) {
        $tried++;
        $subject = '=?UTF-8?B?' . base64_encode('Заявка с сайта ortorecovery.ru') . '?=';
        $headers = "Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit";
        if (!empty($c['email_from'])) $headers .= "\r\nFrom: " . $c['email_from'];
        if (@mail($c['email'], $subject, $text, $headers)) $ok++; else logline('lead: mail() failed');
    }

    if (!empty($c['telegram_chats']) && is_array($c['telegram_chats'])) {
        foreach ($c['telegram_chats'] as $chat) {
            $tried++;
            if (tg('sendMessage', ['chat_id' => $chat, 'text' => $text])) $ok++;
        }
    }

    if (!empty($c['green_id']) && !empty($c['green_token']) && !empty($c['whatsapp_to'])) {
        $tried++;
        $base = rtrim(!empty($c['green_url']) ? $c['green_url'] : 'https://api.green-api.com', '/');
        $to = strpos($c['whatsapp_to'], '@') !== false ? $c['whatsapp_to'] : $c['whatsapp_to'] . '@c.us';
        list($code) = http_req('POST', "$base/waInstance{$c['green_id']}/sendMessage/{$c['green_token']}",
            json_encode(['chatId' => $to, 'message' => $text], JSON_UNESCAPED_UNICODE), ['Content-Type: application/json'], 10);
        if ($code >= 200 && $code < 300) $ok++; else logline("lead: green api http $code");
    }

    if ($tried === 0) return 'none';
    return $ok > 0 ? 'sent' : 'failed';
}
