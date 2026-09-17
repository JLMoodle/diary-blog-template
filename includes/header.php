<?php
// ============================================================
// includes/header.php — общая «шапка» сайта.
// С лабы 7: подключается в начале каждой PHP-страницы:
//   <?php require __DIR__ . '/includes/header.php'; ?>
// Ожидает переменную $pageTitle (задаётся до подключения).
// ============================================================
?><!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= isset($pageTitle) ? $pageTitle . ' — Мой дневник' : 'Мой дневник'; ?></title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
<header>
  <h1><a href="/">Мой дневник</a></h1>
  <nav>
    <!-- Лаб 8–11: пункты меню (главная, категории, добавить запись) -->
  </nav>
</header>