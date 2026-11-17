<?php
// Настройки PHP-части сайта ortorecovery.ru. Скопируйте в www/orto-private/config.php на хостинге REG.RU
// (папка РЯДОМ с папкой сайта www/ortorecovery.ru, а не внутри неё) и заполните.
// Этот файл не попадает в репозиторий и на сайт — пароли и токены храните только там.
return [
    'site_url' => 'https://ortorecovery.ru',

    // --- Бот для статей ---
    'bot_token' => '',        // от @BotFather
    'webhook_secret' => '',   // любая длинная случайная строка (латиница и цифры, 32+ символа)
    'admin_key' => '',        // ещё одна случайная строка — для страницы bot/setup.php?key=...
    'github_token' => '',     // fine-grained token: доступ только к репозиторию ниже, Contents: Read and write
    'github_repo' => 'sarrinoj-glitch/orto-recovery-full',
    'github_branch' => 'main',
    // Кто пишет статьи: Telegram ID => ФИО точно как на сайте (только врачи с лицензией)
    'authors' => [
        // 123456789 => 'Хаджалов Абузар Магомедович',
    ],
    // Кто одобряет перед публикацией (Telegram ID). Пусто — врач публикует сам.
    'approvers' => [
        // 987654321,
    ],

    // --- Заявки с сайта (форма «Записаться») ---
    'lead' => [
        'email' => '',            // почта клиники — бесплатно
        'email_from' => '',       // например: ortorecovery.ru <noreply@ortorecovery.ru>
        'telegram_chats' => [],   // Telegram ID администраторов (они должны написать боту /start) — бесплатно
        // WhatsApp через Green API — по желанию, платно
        'green_id' => '',
        'green_token' => '',
        'green_url' => 'https://api.green-api.com',
        'whatsapp_to' => '',      // 79XXXXXXXXX
    ],
];
