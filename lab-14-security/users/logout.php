<?php
/**
 * users/logout.php — выход (лаба 14).
 * Изменение состояния (сессии) идёт только через POST с CSRF-токеном.
 */

require dirname(__DIR__) . '/includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Разрешён только POST.';
    exit;
}

require_csrf();

$_SESSION = [];
session_destroy();

header('Location: /index.php');
exit;