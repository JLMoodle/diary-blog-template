<?php
/**
 * includes/functions.php — вспомогательные функции (лабы 7–9).
 */

require_once __DIR__ . '/db.php';

/**
 * Экранирование вывода: спецсимволы превращаются в HTML-сущности.
 */
function e(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * Белый список категорий (лаба 8). В лабе 12 заменится выборкой из таблицы categories.
 */
function getCategories(): array
{
    return ['study', 'hobby', 'tech', 'life'];
}

/**
 * Все записи из таблицы posts (лаба 9). Запросов на странице — ровно один.
 */
function getPosts(): array
{
    $stmt = db()->query('SELECT * FROM posts ORDER BY created_at DESC');
    return $stmt->fetchAll();
}