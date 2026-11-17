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

    // --- Заявки с сайта (форма «Записаться») → WhatsApp администратора ---
    'lead' => [
        // Green API (console.green-api.com): инстанс, к которому по QR-коду привязан ОТДЕЛЬНЫЙ номер-отправитель
        // (не основной номер клиники). Тариф «Разработчик» бесплатный, до 3 чатов — заявки идут в один чат.
        'green_id' => '',         // idInstance
        'green_token' => '',      // apiTokenInstance
        'green_url' => 'https://api.green-api.com', // apiUrl из личного кабинета Green API
        'whatsapp_to' => '79883011805', // куда приходят заявки: WhatsApp центра
        // Запасные каналы, по желанию
        'email' => '',            // почта клиники
        'email_from' => '',       // например: ortorecovery.ru <noreply@ortorecovery.ru>
        'telegram_chats' => [],   // Telegram ID администраторов (должны написать боту /start)
    ],
];
