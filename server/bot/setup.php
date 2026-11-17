<?php
// Однократная настройка и проверка: https://ortorecovery.ru/bot/setup.php?key=<admin_key из config.php>
// Проверяет папку с данными, связь с Telegram и GitHub и регистрирует адрес бота в Telegram.
define('ORTO', 1);
require __DIR__ . '/../inc/common.php';
require __DIR__ . '/../inc/github.php';
header('Content-Type: text/plain; charset=utf-8');
header('X-Robots-Tag: noindex');

$key = (string)cfg('admin_key');
if (!is_file(PRIV . '/config.php')) {
    exit("Нет файла настроек. Создайте папку и файл:\n" . PRIV . "/config.php\n(образец — server/config.example.php в репозитории сайта)\n");
}
if ($key === '' || !isset($_GET['key']) || !hash_equals($key, (string)$_GET['key'])) { http_response_code(404); exit; }

$ok = true;
$line = function ($good, $text) use (&$ok) { if (!$good) $ok = false; echo ($good ? '[OK]  ' : '[ОШИБКА] ') . $text . "\n"; };

$line(version_compare(PHP_VERSION, '7.4', '>='), 'PHP ' . PHP_VERSION . ' (нужен 7.4 или новее)');
$line(function_exists('curl_init'), 'расширение curl');
$line(function_exists('mb_strlen'), 'расширение mbstring');
@mkdir(PRIV . '/drafts', 0700, true);
$line(is_writable(PRIV . '/drafts'), 'запись в ' . PRIV);

$me = tg('getMe');
$line((bool)$me, $me ? 'Telegram-бот @' . $me['username'] : 'Telegram: проверьте bot_token');
list($c, $repo) = gh('GET', '');
$line($c === 200, $c === 200 ? 'GitHub: доступ к ' . cfg('github_repo') : "GitHub: ответ $c — проверьте github_token и github_repo");
$line(is_array(cfg('authors')) && count(cfg('authors')) > 0, 'авторы (врачи) в config.php: ' . (is_array(cfg('authors')) ? count(cfg('authors')) : 0));

if ($me) {
    $url = site_url() . '/bot/webhook.php';
    $r = tg('setWebhook', ['url' => $url, 'secret_token' => cfg('webhook_secret'), 'allowed_updates' => ['message', 'callback_query'], 'max_connections' => 5]);
    $line((bool)$r, 'адрес бота в Telegram: ' . $url);
    tg('setMyCommands', ['commands' => [
        ['command' => 'new', 'description' => 'Новая статья'],
        ['command' => 'draft', 'description' => 'Текущий черновик'],
        ['command' => 'list', 'description' => 'Мои статьи на сайте'],
        ['command' => 'cancel', 'description' => 'Удалить черновик'],
        ['command' => 'help', 'description' => 'Как пользоваться'],
    ]]);
    $info = tg('getWebhookInfo');
    if ($info && !empty($info['last_error_message'])) echo "       последняя ошибка Telegram: {$info['last_error_message']}\n";
}
echo "\n" . ($ok ? 'Всё готово. Врачи пишут боту /start.' : 'Исправьте ошибки и откройте эту страницу ещё раз.') . "\n";
