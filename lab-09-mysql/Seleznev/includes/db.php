<?php
/**
 * includes/db.php — подключение к MySQL через PDO (лаба 9).
 * Параметры берутся из окружения (.env), не хардкодятся в коде.
 */

require_once __DIR__ . '/env.php';

/**
 * Единственное PDO-подключение на весь запрос (static $pdo).
 */
function db(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $dsn = sprintf(
            'mysql:host=%s;dbname=%s;charset=utf8mb4',
            getenv('DB_HOST') ?: '127.0.0.1',
            getenv('DB_NAME') ?: 'diary_db'
        );

        $pdo = new PDO($dsn, getenv('DB_USER') ?: 'root', getenv('DB_PASS') ?: '', [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }

    return $pdo;
}