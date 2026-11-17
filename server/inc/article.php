<?php
// Статья блога из того, что врач прислал боту: разметка, проверка текста, сборка JSON для content/blog.
if (!defined('ORTO')) { http_response_code(404); exit; }

// Направления сайта (src/lib/nav.ts): название, рубрика блога, обложка по умолчанию (public/photos)
const SERVICES = [
    'spina' => ['Боль в спине и шее', 'Спина и шея', 'c-back.jpg'],
    'koleno' => ['Колено и тазобедренный сустав', 'Суставы и стопы', 'g-mri.jpg'],
    'plecho' => ['Плечо, локоть и кисть', 'Суставы и стопы', 'c-shoulder.jpg'],
    'stopa' => ['Стопа и пятка', 'Суставы и стопы', 'foot.jpg'],
    'prp' => ['Внутрисуставные инъекции', 'Суставы и стопы', 'eq-lab.jpg'],
    'reabilitaciya' => ['Восстановление после травм и операций', 'Восстановление', 'g-lfk.jpg'],
    'fizioterapiya' => ['Физиотерапия', 'Восстановление', 'g-magnet.jpg'],
    'lechebnaya-fizkultura' => ['Лечебная физкультура', 'Восстановление', 'g-lfk.jpg'],
    'detyam' => ['Осанка и стопы у детей', 'Дети', 'g-explain.jpg'],
];

const FINAL_NOTE = 'Статья носит информационный характер и не заменяет консультацию врача.';

function translit($s, $max = 50)
{
    $map = ['а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'д' => 'd', 'е' => 'e', 'ё' => 'e', 'ж' => 'zh', 'з' => 'z', 'и' => 'i',
        'й' => 'y', 'к' => 'k', 'л' => 'l', 'м' => 'm', 'н' => 'n', 'о' => 'o', 'п' => 'p', 'р' => 'r', 'с' => 's', 'т' => 't',
        'у' => 'u', 'ф' => 'f', 'х' => 'h', 'ц' => 'c', 'ч' => 'ch', 'ш' => 'sh', 'щ' => 'sch', 'ъ' => '', 'ы' => 'y', 'ь' => '',
        'э' => 'e', 'ю' => 'yu', 'я' => 'ya'];
    $s = strtr(mb_strtolower((string)$s, 'UTF-8'), $map);
    $s = trim(preg_replace('/[^a-z0-9]+/', '-', $s), '-');
    if (strlen($s) > $max) {
        $s = substr($s, 0, $max);
        $cut = strrpos($s, '-');
        if ($cut !== false && $cut > 15) $s = substr($s, 0, $cut);
        $s = trim($s, '-');
    }
    return $s !== '' ? $s : 'statya';
}

// **жирный** → <b>; остальное экранируется
function inline_html($s)
{
    return preg_replace('/\*\*(.+?)\*\*/u', '<b>$1</b>', h($s));
}

// Простая разметка: «# » — подзаголовок, «- », «• », «1. » — пункты списка, каждая строка — абзац
function text_to_html($text, &$ids)
{
    $html = '';
    $list = null; // ['tag' => 'ul'|'ol', 'items' => []]
    $flush = function () use (&$html, &$list) {
        if ($list) {
            $html .= '<' . $list['tag'] . '>' . implode('', array_map(function ($i) { return '<li>' . $i . '</li>'; }, $list['items'])) . '</' . $list['tag'] . '>';
            $list = null;
        }
    };
    foreach (preg_split('/\R/u', (string)$text) as $line) {
        $line = trim($line);
        if ($line === '') { $flush(); continue; }
        if (preg_match('/^#+\s*(.+)$/u', $line, $m)) {
            $flush();
            $title = trim(str_replace('**', '', $m[1]));
            $id = translit($title, 40);
            $base = $id;
            $n = 2;
            while (isset($ids[$id])) $id = $base . '-' . $n++;
            $ids[$id] = true;
            $html .= '<h2 id="' . $id . '">' . h($title) . '</h2>';
            continue;
        }
        if (preg_match('/^(?:([-•*—–])|(\d+)[.)])\s*(.+)$/u', $line, $m) && trim($m[3]) !== '') {
            $tag = $m[1] !== '' ? 'ul' : 'ol';
            if ($list && $list['tag'] !== $tag) $flush();
            if (!$list) $list = ['tag' => $tag, 'items' => []];
            $list['items'][] = inline_html(trim($m[3]));
            continue;
        }
        $flush();
        $html .= '<p>' . inline_html($line) . '</p>';
    }
    $flush();
    return $html;
}

function urgent_items($text)
{
    $items = [];
    foreach (preg_split('/\R/u', (string)$text) as $line) {
        $line = trim(preg_replace('/^(?:[-•*—–]|\d+[.)])\s*/u', '', trim($line)));
        if ($line !== '') $items[] = inline_html($line);
    }
    return $items;
}

function article_html($d)
{
    $ids = ['kogda-k-vrachu' => true];
    $html = text_to_html(isset($d['body']) ? $d['body'] : '', $ids);
    $items = urgent_items(isset($d['urgent']) ? $d['urgent'] : '');
    if ($items) {
        $html .= '<h2 id="kogda-k-vrachu">Когда не откладывать визит к врачу</h2>'
            . '<div class="callout warn"><b>Обратитесь к врачу без промедления, если:</b><ul><li>' . implode('</li><li>', $items) . '</li></ul></div>';
    }
    return $html . '<div class="callout"><p>' . FINAL_NOTE . '</p></div>';
}

function words_minutes($html)
{
    $words = count(preg_split('/\s+/u', trim(strip_tags($html)), -1, PREG_SPLIT_NO_EMPTY));
    return max(3, (int)round($words / 170));
}

// Проверка по закону о рекламе медуслуг (ст. 24 38-ФЗ) и врачебной тайне.
// block — публиковать нельзя, пока не исправлено; warn — врач должен подтвердить, что формулировка корректна.
function check_text($d)
{
    $text = implode("\n", [
        isset($d['title']) ? $d['title'] : '', isset($d['lead']) ? $d['lead'] : '',
        isset($d['body']) ? $d['body'] : '', isset($d['urgent']) ? $d['urgent'] : '',
    ]);
    $block = [
        '/гарантир\w*/iu' => 'гарантии результата',
        '/100\s*%/u' => '«100 %»',
        '/навсегда/iu' => '«навсегда»',
        '/(?:вылеч|излеч|исцел)(?:им|ил|ила|или|ено|ен|ена|ены)\b/iu' => 'случаи излечения',
        '/чуд(?:о|есн)\w*/iu' => '«чудо»',
        '/без\s+побочн\w*/iu' => '«без побочных эффектов»',
        '/абсолютно\s+безопасн\w*/iu' => '«абсолютно безопасно»',
        '/№\s*1\b|номер\s+один/iu' => '«№ 1»',
        '/спасибо\s+(?:доктор|врач)\w*|благодар\w+\s+(?:доктор|врач)\w*/iu' => 'благодарности пациентов',
        '/(?:\+7|\b8)[\s\-()]*\d{3}[\s\-()]*\d{3}[\s\-]*\d{2}[\s\-]*\d{2}/u' => 'номер телефона',
    ];
    $warn = [
        '/\bлучш(?:ий|ая|ее|ие|его|ей|ую|им|ими|их)\b/iu' => '«лучший»',
        '/единственн\w+/iu' => '«единственный»',
        '/мгновенн\w*/iu' => '«мгновенный»',
        '/в\s+отличие\s+от\s+других|(?:лучше|дешевле|эффективнее)\s+(?:чем\s+)?(?:в\s+)?други\w+/iu' => 'сравнение с другими клиниками',
        '/пациент\w*\s+[А-ЯЁ][а-яё]+/u' => 'возможно, имя пациента',
    ];
    $found = ['block' => [], 'warn' => []];
    foreach (['block' => $block, 'warn' => $warn] as $kind => $rules) {
        foreach ($rules as $re => $label) {
            if (preg_match($re, $text, $m)) $found[$kind][] = $label . ': «' . mb_substr($m[0], 0, 40, 'UTF-8') . '»';
        }
    }
    return $found;
}

// JSON статьи для content/blog/<slug>.json (читает scripts/blog.mjs)
function article_json($d, $slug, $cover, $date)
{
    $svc = SERVICES[$d['service']];
    return [
        'slug' => $slug,
        'title' => trim($d['title']),
        'lead' => trim($d['lead']),
        'category' => $svc[1],
        'service' => $d['service'],
        'reviewer' => $d['author'],
        'cover' => $cover,
        'coverAlt' => trim($d['title']),
        'date' => $date,
        'html' => article_html($d),
        // исходный текст врача — чтобы статью можно было изменить через бота
        'source' => ['title' => $d['title'], 'lead' => $d['lead'], 'body' => $d['body'], 'urgent' => isset($d['urgent']) ? $d['urgent'] : ''],
    ];
}
