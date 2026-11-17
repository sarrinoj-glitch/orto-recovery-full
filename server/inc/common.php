<?php
// Общие функции PHP-части сайта на хостинге REG.RU: настройки, файлы, HTTP, Telegram.
// Совместимо с PHP 7.4+. Секреты лежат вне папки сайта: www/orto-private/config.php (образец — server/config.example.php).
if (!defined('ORTO')) { http_response_code(404); exit; }

// www/ortorecovery.ru/inc → www/orto-private (папка рядом с сайтом, из интернета недоступна)
define('PRIV', dirname(__DIR__, 2) . '/orto-private');

function cfg($key = null)
{
    static $c = null;
    if ($c === null) {
        $f = PRIV . '/config.php';
        $c = is_file($f) ? (require $f) : [];
        if (!is_array($c)) $c = [];
    }
    if ($key === null) return $c;
    return array_key_exists($key, $c) ? $c[$key] : null;
}

function priv_path($rel)
{
    $p = PRIV . '/' . $rel;
    $d = dirname($p);
    if (!is_dir($d)) @mkdir($d, 0700, true);
    return $p;
}

function jread($rel, $def = null)
{
    $p = PRIV . '/' . $rel;
    if (!is_file($p)) return $def;
    $j = json_decode((string)file_get_contents($p), true);
    return $j === null ? $def : $j;
}

function jwrite($rel, $data)
{
    $p = priv_path($rel);
    file_put_contents($p . '.tmp', json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
    rename($p . '.tmp', $p);
}

function jdelete($rel)
{
    $p = PRIV . '/' . $rel;
    if (is_file($p)) @unlink($p);
}

// В журнал — только технические сведения, без текстов и данных пациентов
function logline($msg)
{
    if (!is_dir(PRIV)) return;
    @file_put_contents(PRIV . '/log.txt', date('c') . ' ' . $msg . "\n", FILE_APPEND | LOCK_EX);
}

function http_req($method, $url, $body = null, $headers = [], $timeout = 15)
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_TIMEOUT => $timeout,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_HTTPHEADER => $headers,
    ]);
    if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    $res = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    return [$code, $res === false ? '' : (string)$res, $err];
}

function tg($method, $params = [])
{
    $t = cfg('bot_token');
    if (!$t) return null;
    list($code, $res) = http_req('POST', "https://api.telegram.org/bot$t/$method",
        json_encode($params, JSON_UNESCAPED_UNICODE), ['Content-Type: application/json']);
    $j = json_decode($res, true);
    if (!$j || empty($j['ok'])) {
        logline("telegram $method http $code: " . (isset($j['description']) ? $j['description'] : 'no answer'));
        return null;
    }
    return $j['result'];
}

function site_url()
{
    $u = cfg('site_url');
    if ($u) return rtrim($u, '/');
    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'ortorecovery.ru';
    return 'https://' . $host;
}

function h($s)
{
    return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
}

function ulen($s)
{
    return mb_strlen((string)$s, 'UTF-8');
}
