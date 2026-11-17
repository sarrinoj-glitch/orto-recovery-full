<?php
// Telegram-бот «Статьи для сайта»: врач по шагам присылает текст → предпросмотр → публикация на ortorecovery.ru.
// Хранилище — файлы в www/orto-private: drafts/<telegram id>.json (+ .jpg), pending/<код>.json, published.json.
if (!defined('ORTO')) { http_response_code(404); exit; }

const STEPS = ['title', 'lead', 'body', 'urgent', 'service', 'cover'];

// ---------- роли ----------
function author_name($uid)
{
    $a = cfg('authors');
    return (is_array($a) && isset($a[$uid])) ? $a[$uid] : null;
}

function is_approver($uid)
{
    $a = cfg('approvers');
    return is_array($a) && in_array($uid, $a, true);
}

function needs_approval($uid)
{
    $a = cfg('approvers');
    return is_array($a) && count($a) > 0 && !is_approver($uid);
}

// ---------- Telegram ----------
function kb($rows)
{
    $out = [];
    foreach ($rows as $row) {
        $r = [];
        foreach ($row as $data => $text) $r[] = ['text' => $text, 'callback_data' => (string)$data];
        $out[] = $r;
    }
    return ['inline_keyboard' => $out];
}

function say($chat, $text, $markup = null)
{
    $p = ['chat_id' => $chat, 'text' => $text, 'disable_web_page_preview' => true];
    if ($markup) $p['reply_markup'] = $markup;
    return tg('sendMessage', $p);
}

// ---------- черновики ----------
function draft_load($uid)
{
    return jread("drafts/$uid.json");
}

function draft_save($uid, &$d)
{
    $d['updated'] = time();
    jwrite("drafts/$uid.json", $d);
}

function draft_photo($uid)
{
    return PRIV . "/drafts/$uid.jpg";
}

function draft_delete($uid)
{
    jdelete("drafts/$uid.json");
    jdelete("drafts/$uid.jpg");
}

function preview_link($key)
{
    $sig = substr(hash_hmac('sha256', 'prev|' . $key, (string)cfg('webhook_secret')), 0, 24);
    return site_url() . '/bot/preview.php?k=' . rawurlencode($key) . '&s=' . $sig;
}

function field_done($d, $f)
{
    if ($f === 'urgent') return !empty($d['urgent_done']);
    if ($f === 'cover') return !empty($d['cover_done']);
    return isset($d[$f]) && trim((string)$d[$f]) !== '';
}

// ---------- шаги ----------
function ask($chat, $f, $d)
{
    switch ($f) {
        case 'title':
            say($chat, "1/6. Заголовок статьи — лучше как вопрос или проблема пациента.\nНапример: «Пяточная шпора: когда помогает ударно-волновая терапия».\n\nМожно надиктовать: значок микрофона на клавиатуре телефона.");
            break;
        case 'lead':
            say($chat, "2/6. Коротко, о чём статья — 1–2 предложения. Это видно в списке статей и в поиске Яндекса.");
            break;
        case 'body':
            say($chat, "3/6. Текст статьи. Можно несколькими сообщениями.\n\n• Подзаголовок — строка, которая начинается с #\n• Пункт списка — строка с «-» в начале\n• Каждая новая строка — новый абзац\n\nКогда закончите, нажмите «Текст готов».", kb([['body:done' => 'Текст готов']]));
            break;
        case 'urgent':
            say($chat, "4/6. С какими признаками нельзя ждать и надо сразу к врачу? Каждый признак — с новой строки.\nЕсли для этой темы не нужно — «Пропустить».", kb([['urgent:skip' => 'Пропустить']]));
            break;
        case 'service':
            $rows = [];
            foreach (SERVICES as $slug => $s) $rows[] = ['svc:' . $slug => $s[0]];
            say($chat, "5/6. К какому направлению относится статья? Она появится в блоге и на странице этого направления.", kb($rows));
            break;
        case 'cover':
            say($chat, "6/6. Обложка: пришлите фото (лучше горизонтальное) или возьмите стандартную обложку направления.", kb([['cover:default' => 'Стандартная обложка']]));
            break;
    }
}

function advance($uid, $chat, &$d)
{
    if (!empty($d['reviewed'])) {
        $d['step'] = 'review';
        draft_save($uid, $d);
        show_review($uid, $chat, $d);
        return;
    }
    foreach (STEPS as $f) {
        if (!field_done($d, $f)) {
            $d['step'] = $f;
            draft_save($uid, $d);
            ask($chat, $f, $d);
            return;
        }
    }
    $d['step'] = 'review';
    $d['reviewed'] = true;
    draft_save($uid, $d);
    show_review($uid, $chat, $d);
}

function show_review($uid, $chat, $d)
{
    $svc = SERVICES[$d['service']];
    $found = check_text($d);
    $msg = "Черновик: «{$d['title']}»\nНаправление: {$svc[0]} · рубрика «{$svc[1]}»\n"
        . 'Около ' . words_minutes(article_html($d)) . " мин чтения\n\nПредпросмотр: " . preview_link((string)$uid);
    $rows = [];
    if ($found['block']) {
        $msg .= "\n\nНужно исправить — так писать о медицинских услугах нельзя (закон о рекламе, врачебная тайна):\n— " . implode("\n— ", $found['block']);
    } elseif ($found['warn'] && empty($d['warn_ok'])) {
        $msg .= "\n\nПроверьте формулировки — они допустимы только если это факт, без рекламы и без данных пациентов:\n— " . implode("\n— ", $found['warn']);
        $rows[] = ['rev:warnok' => 'Проверил, всё корректно'];
    } else {
        $rows[] = ['rev:pub' => needs_approval($uid) ? 'Отправить на проверку' : 'Опубликовать'];
    }
    $rows[] = ['rev:edit' => 'Исправить', 'rev:del' => 'Удалить черновик'];
    say($chat, $msg, kb($rows));
}

function edit_menu($chat)
{
    say($chat, 'Что исправить?', kb([
        ['edit:title' => 'Заголовок', 'edit:lead' => 'Коротко о статье'],
        ['edit:body' => 'Текст', 'edit:urgent' => 'Когда к врачу'],
        ['edit:service' => 'Направление', 'edit:cover' => 'Обложку'],
        ['rev:back' => '← Назад'],
    ]));
}

// ---------- публикация ----------
function publish($d, $photoPath)
{
    $index = jread('published.json', []);
    if (!empty($d['slug'])) {
        $slug = $d['slug'];
    } else {
        $base = translit($d['title']);
        $slug = $base;
        for ($n = 2; isset($index[$slug]) || gh_exists("content/blog/$slug.json"); $n++) $slug = $base . '-' . $n;
    }
    $files = [];
    if (!empty($d['photo']) && is_file($photoPath)) {
        $cover = 'blog-' . $slug . '-' . date('ymdHis') . '.jpg';
        $files["public/photos/$cover"] = file_get_contents($photoPath);
    } elseif (!empty($d['existing_cover'])) {
        $cover = $d['existing_cover'];
    } else {
        $cover = SERVICES[$d['service']][2];
    }
    $date = !empty($d['date']) ? $d['date'] : date('Y-m-d');
    $json = article_json($d, $slug, $cover, $date);
    $files["content/blog/$slug.json"] = json_encode($json, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
    gh_commit((empty($d['slug']) ? 'Статья: ' : 'Статья изменена: ') . $json['title'] . ' (бот, ' . $d['author'] . ')', $files);
    $index[$slug] = ['title' => $json['title'], 'author' => $d['author'], 'date' => $date, 'cover' => $cover];
    jwrite('published.json', $index);
    return site_url() . "/blog/$slug/";
}

function do_publish($uid, $chat, $d, $photoPath)
{
    say($chat, 'Публикую…');
    try {
        $url = publish($d, $photoPath);
    } catch (Exception $e) {
        logline('publish failed: ' . $e->getMessage());
        say($chat, 'Не получилось опубликовать: ошибка связи с сервером сайта. Черновик сохранён — попробуйте позже или напишите разработчику.');
        return null;
    }
    return $url;
}

// ---------- команды ----------
function cmd($uid, $chat, $text)
{
    $c = strtolower(preg_replace('/@\S+/', '', explode(' ', $text)[0]));
    $author = author_name($uid);
    if ($c === '/start' || $c === '/help') {
        say($chat, "Бот публикует статьи врачей на сайте ortorecovery.ru.\n\n/new — новая статья\n/draft — текущий черновик\n/list — опубликованные статьи: изменить или скрыть\n/cancel — удалить черновик\n\nСтатья выходит под вашим именем, после вашей проверки" . (cfg('approvers') ? ' и одобрения руководителя' : '') . '.');
        return;
    }
    if ($c === '/new') {
        if (!$author) { say($chat, 'Писать статьи могут только врачи центра. Ваш Telegram ID: ' . $uid); return; }
        $d = draft_load($uid);
        if ($d && !empty($d['title'])) {
            say($chat, "Есть незаконченный черновик «{$d['title']}».", kb([['new:cont' => 'Продолжить', 'new:reset' => 'Начать заново']]));
            return;
        }
        new_draft($uid, $chat, $author);
        return;
    }
    if ($c === '/draft') {
        $d = draft_load($uid);
        if (!$d) { say($chat, 'Черновика нет. Новая статья — /new'); return; }
        resume($uid, $chat, $d);
        return;
    }
    if ($c === '/cancel') {
        draft_delete($uid);
        say($chat, 'Черновик удалён. Новая статья — /new');
        return;
    }
    if ($c === '/list') {
        list_articles($uid, $chat);
        return;
    }
    say($chat, 'Не знаю такой команды. Список команд — /help');
}

function new_draft($uid, $chat, $author)
{
    draft_delete($uid);
    $d = ['author' => $author, 'step' => 'title'];
    advance($uid, $chat, $d);
}

function resume($uid, $chat, $d)
{
    if ($d['step'] === 'pending') { say($chat, 'Статья «' . $d['title'] . '» на проверке у руководителя. Когда её одобрят или вернут, я напишу.'); return; }
    if ($d['step'] === 'review') { show_review($uid, $chat, $d); return; }
    ask($chat, $d['step'], $d);
}

function list_articles($uid, $chat)
{
    $index = jread('published.json', []);
    $me = author_name($uid);
    $rows = [];
    foreach ($index as $slug => $a) {
        if (!is_approver($uid) && $a['author'] !== $me) continue;
        $t = mb_strimwidth($a['title'], 0, 34, '…', 'UTF-8');
        $rows[] = ['ls:edit:' . $slug => '✏️ ' . $t, 'ls:hide:' . $slug => 'Скрыть'];
        if (count($rows) >= 20) break;
    }
    if (!$rows) { say($chat, 'Статей, опубликованных через бота, пока нет.'); return; }
    say($chat, "Статьи на сайте (опубликованные через бота):", kb($rows));
}

// ---------- сообщения ----------
function on_message($m)
{
    if (!isset($m['chat']['type']) || $m['chat']['type'] !== 'private') return;
    $uid = (int)$m['from']['id'];
    $chat = $m['chat']['id'];
    $author = author_name($uid);
    if (!$author && !is_approver($uid)) {
        say($chat, "Это служебный бот центра «Орто-Рекавери» для публикации статей врачей.\nВаш Telegram ID: $uid — передайте его разработчику сайта, чтобы получить доступ.");
        return;
    }
    $text = isset($m['text']) ? trim($m['text']) : '';
    if ($text !== '' && $text[0] === '/') { cmd($uid, $chat, $text); return; }
    if (!$author) { say($chat, 'Статьи на проверку придут сюда. Команды — /help'); return; }

    $d = draft_load($uid);
    if (!$d) { say($chat, 'Чтобы начать статью, отправьте /new'); return; }
    $step = $d['step'];

    if (isset($m['photo'])) {
        if ($step !== 'cover') { say($chat, $step === 'body' ? 'Фото внутри текста пока не поддерживаются. Обложку я попрошу на 6-м шаге.' : 'Фото сейчас не нужно.'); return; }
        save_photo($uid, $chat, $d, end($m['photo']));
        return;
    }
    if (isset($m['document']) && $step === 'cover') { say($chat, 'Пришлите картинку как фото, а не файлом.'); return; }
    if (isset($m['voice'])) { say($chat, 'Голосовые сообщения бот не расшифровывает. Нажмите значок микрофона на клавиатуре — телефон сам превратит речь в текст, и отправьте как обычное сообщение.'); return; }
    if ($text === '') return;

    switch ($step) {
        case 'title':
            if (ulen($text) < 10 || ulen($text) > 120) { say($chat, 'Заголовок — от 10 до 120 символов. Сейчас: ' . ulen($text) . '.'); return; }
            $d['title'] = $text;
            advance($uid, $chat, $d);
            return;
        case 'lead':
            if (ulen($text) < 30 || ulen($text) > 300) { say($chat, 'Коротко о статье — от 30 до 300 символов. Сейчас: ' . ulen($text) . '.'); return; }
            $d['lead'] = $text;
            advance($uid, $chat, $d);
            return;
        case 'body':
            $d['body'] = trim((isset($d['body']) ? $d['body'] . "\n\n" : '') . $text);
            if (ulen($d['body']) > 30000) { say($chat, 'Текст слишком длинный — больше 30 000 символов. Разделите на две статьи.'); return; }
            draft_save($uid, $d);
            say($chat, 'Принял (' . ulen($d['body']) . ' символов). Продолжайте или нажмите «Текст готов».', kb([['body:done' => 'Текст готов'], ['body:clear' => 'Стереть текст и начать заново']]));
            return;
        case 'urgent':
            $d['urgent'] = $text;
            $d['urgent_done'] = true;
            advance($uid, $chat, $d);
            return;
        case 'service':
            ask($chat, 'service', $d);
            return;
        case 'cover':
            ask($chat, 'cover', $d);
            return;
        case 'pending':
            resume($uid, $chat, $d);
            return;
        default:
            say($chat, 'Используйте кнопки под черновиком. Показать черновик — /draft');
    }
}

function save_photo($uid, $chat, &$d, $photo)
{
    if (!empty($photo['file_size']) && $photo['file_size'] > 10 * 1024 * 1024) { say($chat, 'Фото больше 10 МБ — пришлите поменьше.'); return; }
    $f = tg('getFile', ['file_id' => $photo['file_id']]);
    if (!$f || empty($f['file_path'])) { say($chat, 'Не удалось получить фото, пришлите ещё раз.'); return; }
    list($code, $bin) = http_req('GET', 'https://api.telegram.org/file/bot' . cfg('bot_token') . '/' . $f['file_path'], null, [], 30);
    if ($code !== 200 || substr($bin, 0, 3) !== "\xFF\xD8\xFF") { say($chat, 'Не удалось сохранить фото, пришлите ещё раз.'); return; }
    priv_path("drafts/$uid.jpg");
    file_put_contents(draft_photo($uid), $bin);
    $d['photo'] = false; // станет true после ответа про пациента
    draft_save($uid, $d);
    say($chat, 'На фото есть пациент?', kb([
        ['photo:none' => 'Пациента нет'],
        ['photo:consent' => 'Есть, согласие подписано'],
        ['photo:other' => 'Пришлю другое фото'],
    ]));
}

// ---------- кнопки ----------
function on_callback($q)
{
    tg('answerCallbackQuery', ['callback_query_id' => $q['id']]);
    $uid = (int)$q['from']['id'];
    $chat = $q['message']['chat']['id'];
    $data = (string)$q['data'];

    // одобрение руководителем
    if (preg_match('/^(ap|rj):([a-f0-9]{12})$/', $data, $m)) {
        if (!is_approver($uid)) return;
        approve($uid, $chat, $m[2], $m[1] === 'ap');
        return;
    }

    $author = author_name($uid);
    if (!$author) return;

    if (preg_match('/^ls:(edit|hide|hideok):([a-z0-9-]+)$/', $data, $m)) {
        list_action($uid, $chat, $author, $m[1], $m[2]);
        return;
    }
    if ($data === 'new:reset') { new_draft($uid, $chat, $author); return; }

    $d = draft_load($uid);
    if (!$d) { say($chat, 'Черновика нет. Новая статья — /new'); return; }
    if ($d['step'] === 'pending') { resume($uid, $chat, $d); return; }

    if ($data === 'new:cont') { resume($uid, $chat, $d); return; }
    if ($data === 'body:done') {
        if (ulen(isset($d['body']) ? $d['body'] : '') < 300) { say($chat, 'Текст пока короче 300 символов — для статьи маловато. Допишите и нажмите «Текст готов».'); return; }
        advance($uid, $chat, $d);
        return;
    }
    if ($data === 'body:clear') { $d['body'] = ''; draft_save($uid, $d); say($chat, 'Текст стёрт. Присылайте заново.'); return; }
    if ($data === 'urgent:skip') { $d['urgent'] = ''; $d['urgent_done'] = true; advance($uid, $chat, $d); return; }
    if (preg_match('/^svc:([a-z-]+)$/', $data, $m) && array_key_exists($m[1], SERVICES)) { $d['service'] = $m[1]; advance($uid, $chat, $d); return; }
    if ($data === 'cover:default') {
        jdelete("drafts/$uid.jpg");
        $d['photo'] = false;
        $d['existing_cover'] = '';
        $d['cover_done'] = true;
        advance($uid, $chat, $d);
        return;
    }
    if ($data === 'photo:none' || $data === 'photo:consent') {
        if (!is_file(draft_photo($uid))) { ask($chat, 'cover', $d); return; }
        $d['photo'] = true;
        $d['cover_done'] = true;
        advance($uid, $chat, $d);
        return;
    }
    if ($data === 'photo:other') { jdelete("drafts/$uid.jpg"); $d['photo'] = false; draft_save($uid, $d); say($chat, 'Хорошо, пришлите другое фото.'); return; }

    if ($data === 'rev:edit') { edit_menu($chat); return; }
    if ($data === 'rev:back') { show_review($uid, $chat, $d); return; }
    if ($data === 'rev:del') { say($chat, 'Удалить черновик «' . $d['title'] . '»?', kb([['rev:delok' => 'Да, удалить', 'rev:back' => 'Нет']])); return; }
    if ($data === 'rev:delok') { draft_delete($uid); say($chat, 'Черновик удалён. Новая статья — /new'); return; }
    if ($data === 'rev:warnok') { $d['warn_ok'] = true; draft_save($uid, $d); show_review($uid, $chat, $d); return; }
    if (preg_match('/^edit:(title|lead|body|urgent|service|cover)$/', $data, $m)) {
        $f = $m[1];
        if ($f === 'body') $d['body'] = '';
        if ($f === 'body' || $f === 'title' || $f === 'lead' || $f === 'urgent') $d['warn_ok'] = false;
        $d['step'] = $f;
        draft_save($uid, $d);
        if ($f === 'body') say($chat, 'Пришлите текст целиком заново.');
        ask($chat, $f, $d);
        return;
    }
    if ($data === 'rev:pub') {
        say($chat, 'Подтвердите: в статье нет ФИО, телефонов, фото и других данных пациентов без их письменного согласия.', kb([['pub:ok' => 'Подтверждаю'], ['rev:back' => '← Назад']]));
        return;
    }
    if ($data === 'pub:ok') {
        $found = check_text($d);
        if ($found['block'] || ($found['warn'] && empty($d['warn_ok']))) { show_review($uid, $chat, $d); return; }
        if (needs_approval($uid)) { submit_for_approval($uid, $chat, $d); return; }
        $url = do_publish($uid, $chat, $d, draft_photo($uid));
        if ($url) {
            draft_delete($uid);
            say($chat, "Готово! Статья появится на сайте после сборки, обычно через несколько минут:\n$url");
        }
        return;
    }
}

function submit_for_approval($uid, $chat, &$d)
{
    $tok = bin2hex(random_bytes(6));
    $p = $d;
    $p['uid'] = $uid;
    $p['chat'] = $chat;
    jwrite("pending/$tok.json", $p);
    if (!empty($d['photo']) && is_file(draft_photo($uid))) copy(draft_photo($uid), priv_path("pending/$tok.jpg"));
    $d['step'] = 'pending';
    draft_save($uid, $d);
    $sent = 0;
    foreach ((array)cfg('approvers') as $a) {
        if (say($a, "Новая статья на проверку от {$d['author']}:\n«{$d['title']}»\n\nПредпросмотр: " . preview_link('p' . $tok),
            kb([['ap:' . $tok => 'Одобрить и опубликовать'], ['rj:' . $tok => 'Вернуть врачу']]))) $sent++;
    }
    say($chat, $sent ? 'Отправил руководителю на проверку. Когда одобрит — статья выйдет, я напишу.' : 'Не удалось отправить руководителю: он ещё не написал боту /start. Попросите его открыть бота.');
    if (!$sent) { $d['step'] = 'review'; draft_save($uid, $d); }
}

function approve($uid, $chat, $tok, $yes)
{
    $p = jread("pending/$tok.json");
    if (!$p) { say($chat, 'Эта статья уже обработана.'); return; }
    $author = (int)$p['uid'];
    $photo = PRIV . "/pending/$tok.jpg";
    if ($yes) {
        $url = do_publish($uid, $chat, $p, $photo);
        if (!$url) return;
        say($chat, "Опубликовано: $url");
        say($p['chat'], "Руководитель одобрил статью «{$p['title']}». Она появится на сайте после сборки, обычно через несколько минут:\n$url");
        $cur = draft_load($author);
        if ($cur && $cur['step'] === 'pending') draft_delete($author);
    } else {
        $d = draft_load($author);
        if ($d && $d['step'] === 'pending') { $d['step'] = 'review'; draft_save($author, $d); }
        say($chat, 'Вернул врачу на доработку.');
        say($p['chat'], "Руководитель вернул статью «{$p['title']}» на доработку. Исправьте и отправьте снова — /draft");
    }
    jdelete("pending/$tok.json");
    jdelete("pending/$tok.jpg");
}

function list_action($uid, $chat, $author, $act, $slug)
{
    $index = jread('published.json', []);
    if (!isset($index[$slug])) { say($chat, 'Статья не найдена.'); return; }
    if (!is_approver($uid) && $index[$slug]['author'] !== $author) { say($chat, 'Изменять можно только свои статьи.'); return; }
    if ($act === 'hide') {
        say($chat, 'Скрыть статью «' . $index[$slug]['title'] . '» с сайта?', kb([['ls:hideok:' . $slug => 'Да, скрыть']]));
        return;
    }
    if ($act === 'hideok') {
        try {
            gh_commit('Статья скрыта: ' . $index[$slug]['title'] . ' (бот)', ["content/blog/$slug.json" => null]);
        } catch (Exception $e) {
            logline('hide failed: ' . $e->getMessage());
            say($chat, 'Не получилось скрыть: ошибка связи с сервером сайта. Попробуйте позже.');
            return;
        }
        unset($index[$slug]);
        jwrite('published.json', $index);
        say($chat, 'Статья скрыта. С сайта она пропадёт после сборки, обычно через несколько минут.');
        return;
    }
    // edit: загружаем исходный текст статьи в черновик
    $d = draft_load($uid);
    if ($d && !empty($d['title'])) { say($chat, "Сначала закончите или удалите текущий черновик «{$d['title']}» (/draft, /cancel)."); return; }
    $raw = gh_file("content/blog/$slug.json");
    $j = $raw ? json_decode($raw, true) : null;
    if (!$j || empty($j['source'])) { say($chat, 'Не удалось загрузить статью. Попробуйте позже.'); return; }
    $d = [
        'author' => $j['reviewer'], 'slug' => $slug, 'date' => $j['date'], 'existing_cover' => $j['cover'],
        'title' => $j['source']['title'], 'lead' => $j['source']['lead'], 'body' => $j['source']['body'], 'urgent' => $j['source']['urgent'],
        'urgent_done' => true, 'service' => $j['service'], 'cover_done' => true, 'photo' => false, 'reviewed' => true, 'step' => 'review',
    ];
    draft_save($uid, $d);
    say($chat, 'Статья загружена в черновик. Исправьте нужное и опубликуйте снова — адрес статьи не изменится.');
    show_review($uid, $chat, $d);
}

function bot_handle($u)
{
    if (isset($u['callback_query'])) { on_callback($u['callback_query']); return; }
    if (isset($u['message'])) on_message($u['message']);
}
