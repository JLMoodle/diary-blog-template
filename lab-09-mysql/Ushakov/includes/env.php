<?php
$envFile = dirname(__DIR__) . '/.env';

if (is_readable($envFile)) {
    foreach (parse_ini_file($envFile) ?: [] as $key => $value) {
        putenv("$key=$value");
        $_ENV[$key] = $value;
    }
}