<?php
// Приём заявки с сайта ortorecovery.ru (форма «Записаться»). Тот же ответ, что у прежнего сервера на Vercel:
// 200 — заявка ушла; 503/502 — каналы не настроены или не ответили, форма сама предложит пациенту WhatsApp.
define('ORTO', 1);
require __DIR__ . '/../inc/common.php';
require __DIR__ . '/../inc/lead.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function lead_out($code, $data)
{
    http_response_code($code);
    echo json_encode($data);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') lead_out(405, ['ok' => false, 'error' => 'method']);

// Принимаем только с самого сайта
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';
$allowed = ['https://' . $host, 'https://ortorecovery.ru', 'https://www.ortorecovery.ru'];
if ($origin === '' || !in_array($origin, $allowed, true)) lead_out(403, ['ok' => false, 'error' => 'origin']);

$ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
if (lead_rate_limited($ip)) lead_out(429, ['ok' => false, 'error' => 'rate']);

$raw = file_get_contents('php://input', false, null, 0, 20000);
list($err, $text) = lead_validate(json_decode((string)$raw, true));
if ($err === 'spam') lead_out(200, ['ok' => true]);
if ($err === 'body') lead_out(400, ['ok' => false, 'error' => 'body']);
if ($err) lead_out(422, ['ok' => false, 'error' => 'validation']);

$r = lead_send($text);
if ($r === 'sent') lead_out(200, ['ok' => true]);
if ($r === 'none') lead_out(503, ['ok' => false, 'error' => 'not_configured']);
lead_out(502, ['ok' => false, 'error' => 'provider']);
