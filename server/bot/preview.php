<?php
// Предпросмотр черновика по секретной ссылке из бота. Не индексируется.
define('ORTO', 1);
require __DIR__ . '/../inc/common.php';
require __DIR__ . '/../inc/article.php';

$k = isset($_GET['k']) ? (string)$_GET['k'] : '';
$s = isset($_GET['s']) ? (string)$_GET['s'] : '';
$secret = (string)cfg('webhook_secret');
if ($secret === '' || !preg_match('/^(\d+|p[a-f0-9]{12})$/', $k) || !hash_equals(substr(hash_hmac('sha256', 'prev|' . $k, $secret), 0, 24), $s)) {
    http_response_code(404);
    exit('Ссылка устарела или неверна.');
}
$rel = $k[0] === 'p' ? 'pending/' . substr($k, 1) : 'drafts/' . $k;
$d = jread("$rel.json");
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
if (!$d || empty($d['title']) || empty($d['service']) || !array_key_exists($d['service'], SERVICES)) {
    http_response_code(404);
    exit('Черновик не найден — возможно, он уже опубликован или удалён.');
}
$photo = PRIV . "/$rel.jpg";
if (isset($_GET['img'])) {
    if (empty($d['photo']) || !is_file($photo)) { http_response_code(404); exit; }
    header('Content-Type: image/jpeg');
    readfile($photo);
    exit;
}
$svc = SERVICES[$d['service']];
if (!empty($d['photo']) && is_file($photo)) $cover = '?k=' . rawurlencode($k) . '&s=' . $s . '&img=1';
elseif (!empty($d['existing_cover'])) $cover = '/photos/' . $d['existing_cover'];
else $cover = '/photos/' . $svc[2];
$html = article_html($d);
?><!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>Предпросмотр: <?= h($d['title']) ?></title>
<style>
body{margin:0;background:#F6FBFB;color:#212121;font:17px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}
.bar{background:#F2FF59;padding:10px 16px;font-weight:700;text-align:center;font-size:14px}
.head{background:#E3F6F7;padding:40px 16px 36px}.w{max-width:760px;margin:0 auto;padding:0 16px}
.cat{color:#0E7C86;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
h1{color:#0B3D4A;font-size:clamp(28px,5vw,44px);line-height:1.08;letter-spacing:-.03em;margin:12px 0}
.lead{font-size:19px;color:#4a5458;margin:0}.by{margin-top:18px;font-size:14px;color:#5b6266}
.cover{display:block;width:100%;aspect-ratio:21/9;object-fit:cover;border-radius:24px;margin:24px 0 8px}
article h2{color:#0B3D4A;font-size:26px;line-height:1.2;margin:36px 0 12px}
article ul,article ol{padding-left:22px}article li{margin:6px 0}
.callout{background:#fff;border-radius:18px;padding:16px 20px;margin:24px 0;box-shadow:0 10px 30px -22px rgba(11,61,74,.5)}
.callout.warn{background:#FFF1EC;border-left:4px solid #C2563A}.callout p{margin:0}
.med{margin:32px 0 48px;background:#F4FFC2;border-radius:18px;padding:14px;text-align:center;font-size:14px}
</style></head><body>
<div class="bar">Предпросмотр — статья ещё не опубликована</div>
<div class="head"><div class="w"><div class="cat"><?= h($svc[1]) ?></div><h1><?= h($d['title']) ?></h1><p class="lead"><?= h($d['lead']) ?></p>
<div class="by">Текст проверил: <?= h($d['author']) ?> · около <?= words_minutes($html) ?> мин чтения</div></div></div>
<main class="w"><img class="cover" src="<?= h($cover) ?>" alt="">
<article><?= $html ?></article>
<div class="med">Имеются противопоказания. Необходима консультация специалиста.</div></main>
</body></html>
