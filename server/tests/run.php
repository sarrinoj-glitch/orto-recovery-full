<?php
// Проверки в CI (GitHub Actions): разметка статьи, проверка текста, заявка. Сеть не используется.
define('ORTO', 1);
require __DIR__ . '/../inc/common.php';
require __DIR__ . '/../inc/article.php';
require __DIR__ . '/../inc/lead.php';
require __DIR__ . '/../inc/github.php';
require __DIR__ . '/../inc/bot.php';

$fail = 0;
function t($name, $cond) { global $fail; echo ($cond ? 'ok   ' : 'FAIL ') . $name . "\n"; if (!$cond) $fail++; }

t('translit', translit('Пяточная шпора: когда помогает УВТ?') === 'pyatochnaya-shpora-kogda-pomogaet-uvt');
t('translit cut', strlen(translit(str_repeat('длинное слово ', 20))) <= 50);

$ids = [];
$html = text_to_html("# Почему болит\nПервый абзац <b>с тегом</b> и **важным**.\n- раз\n- два\n1. первый\nВторой абзац\n# Почему болит", $ids);
t('h2 id', strpos($html, '<h2 id="pochemu-bolit">Почему болит</h2>') === 0);
t('h2 unique id', strpos($html, 'id="pochemu-bolit-2"') !== false);
t('escape', strpos($html, '&lt;b&gt;с тегом&lt;/b&gt;') !== false && strpos($html, '<b>важным</b>') !== false);
t('ul then ol', strpos($html, '<ul><li>раз</li><li>два</li></ul><ol><li>первый</li></ol><p>Второй абзац</p>') !== false);

$d = ['title' => 'Болит пятка утром: что делать', 'lead' => 'Разбираем частые причины боли в пятке.', 'body' => "Текст статьи.", 'urgent' => "- отёк и покраснение\nтемпература", 'service' => 'stopa', 'author' => 'Хаджалов Абузар Магомедович'];
$a = article_html($d);
t('urgent block', strpos($a, '<h2 id="kogda-k-vrachu">') !== false && strpos($a, '<li>отёк и покраснение</li><li>температура</li>') !== false);
t('final note', substr($a, -strlen('</p></div>')) === '</p></div>' && strpos($a, FINAL_NOTE) !== false);
$j = article_json($d, 'bolit-pyatka', 'foot.jpg', '2026-11-17');
t('json fields', $j['category'] === 'Суставы и стопы' && $j['reviewer'] === 'Хаджалов Абузар Магомедович' && $j['source']['body'] === 'Текст статьи.');

$c = check_text(['title' => 'Гарантируем результат', 'body' => 'Вылечили 100% пациентов навсегда. Звоните +7 (988) 301-18-05']);
t('block words', count($c['block']) >= 4);
$c = check_text(['title' => 'Лучший метод', 'body' => 'Лучше двигаться, чем лежать. Цена 8 000 ₽.']);
t('warn only', !$c['block'] && count($c['warn']) === 1);
$c = check_text(['title' => 'Боль в колене', 'body' => 'Лучше двигаться, чем лежать. Врач подберёт лечение.']);
t('clean text', !$c['block'] && !$c['warn']);

list($e, $txt) = lead_validate(['name' => 'Анна', 'phone' => '+7 928 000-00-00', 'what' => "колено\x07", 'when' => 'До двух недель', 'why' => 'хак', 'consent' => true, 'page' => '/']);
t('lead ok', $e === null && strpos($txt, 'Как давно: До двух недель') !== false && strpos($txt, 'Травма') === false);
t('lead consent', lead_validate(['name' => 'Анна', 'phone' => '89280000000', 'consent' => 'true'])[0] === 'validation');
t('lead spam', lead_validate(['company' => 'x'])[0] === 'spam');
t('lead not configured', lead_send('x') === 'none');

echo $fail ? "\n$fail FAIL\n" : "\nall ok\n";
exit($fail ? 1 : 0);
