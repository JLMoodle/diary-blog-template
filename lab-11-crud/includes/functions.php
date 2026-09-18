<?php
/**
 * includes/functions.php — вспомогательные функции (лабы 7–11).
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
 * Записи вниз по дате. В лабе 12 заменится JOIN'ом с автором и категорией.
 */
function getPosts(): array
{
    $stmt = db()->query('SELECT * FROM posts ORDER BY created_at DESC');
    return $stmt->fetchAll();
}

/**
 * Одна запись по id. Вернёт null, если такой нет (для 404 на view).
 */
function getPost(int $id): ?array
{
    $stmt = db()->prepare('SELECT * FROM posts WHERE id = ?');
    $stmt->execute([$id]);
    $post = $stmt->fetch();
    return $post ?: null;
}