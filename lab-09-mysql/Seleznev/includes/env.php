<?php
/**
 * includes/env.php — простая загрузка переменных из .env (без библиотек).
 *
 * Перед работой скопируйте .env.example в .env и впишите свои доступы к БД.
 * Файл .env вынесен в .gitignore и никогда не попадает в репозиторий.
 */
$envFile = dirname(__DIR__) . '/.env';

if (is_readable($envFile)) {
    foreach (parse_ini_file($envFile) ?: [] as $key => $value) {
        putenv("$key=$value");
        $_ENV[$key] = $value;
    }
}