<?php
// Сюда Telegram присылает сообщения боту. Адрес и секрет регистрирует bot/setup.php.
define('ORTO', 1);
require __DIR__ . '/../inc/common.php';
require __DIR__ . '/../inc/article.php';
require __DIR__ . '/../inc/github.php';
require __DIR__ . '/../inc/bot.php';

$secret = (string)cfg('webhook_secret');
$got = isset($_SERVER['HTTP_X_TELEGRAM_BOT_API_SECRET_TOKEN']) ? $_SERVER['HTTP_X_TELEGRAM_BOT_API_SECRET_TOKEN'] : '';
if ($secret === '' || !hash_equals($secret, $got)) { http_response_code(401); exit; }

$u = json_decode((string)file_get_contents('php://input'), true);
http_response_code(200);
if (!is_array($u) || !isset($u['update_id'])) exit;

// Telegram повторяет запрос, если ответ задержался — одно и то же сообщение обрабатываем один раз
$seen = (array)jread('seen.json', []);
if (in_array($u['update_id'], $seen, true)) exit;
$seen[] = $u['update_id'];
jwrite('seen.json', array_slice($seen, -300));

try {
    bot_handle($u);
} catch (Throwable $e) {
    logline('bot error: ' . get_class($e) . ' ' . $e->getMessage() . ' @' . basename($e->getFile()) . ':' . $e->getLine());
}
