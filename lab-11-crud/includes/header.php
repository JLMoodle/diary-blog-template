<?php
/**
 * includes/header.php — шапка сайта (лабы 7–14).
 * Переменная $pageTitle задаётся ДО require этого файла.
 */
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
      <a href="/posts/index.php">Записи</a>
      <a href="/posts/add.php">Новая запись</a>
    </nav>
  </header>