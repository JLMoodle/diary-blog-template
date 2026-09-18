<?php
/**
 * includes/header.php — шапка сайта (лабы 7–14).
 * $pageTitle задаётся ДО require; сессия и helpers грузятся здесь на всякий случай.
 */

require_once __DIR__ . '/functions.php';
?><!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= e($pageTitle ?? 'Мой дневник') ?></title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <header>
    <h1>Мой дневник</h1>
    <nav>
      <a href="/index.php">Главная</a>

      <?php if (isLoggedIn()): ?>
        <a href="/posts/add.php">Новая запись</a>
        <form action="/users/logout.php" method="post" class="nav-form">
          <?= csrf_field() ?>
          <button type="submit" class="link-btn">Выйти</button>
        </form>
      <?php else: ?>
        <a href="/users/login.php">Вход</a>
        <a href="/users/register.php">Регистрация</a>
      <?php endif; ?>
    </nav>
  </header>