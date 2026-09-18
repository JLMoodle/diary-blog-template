<?php
/**
 * includes/functions.php — вспомогательные функции (лабы 7–12).
 *
 * Для главной с JOIN/пагинацией нужна ПОЛНАЯ схема лабы 10:
 * таблицы users/comments, колонки user_id/category_id/status в posts,
 * FULLTEXT-индекс ft_posts_search.
 */

require_once __DIR__ . '/db.php';

/** Записей на страницу (пагинация, лаба 12). */
const POSTS_PER_PAGE = 5;

/**
 * Экранирование вывода: спецсимволы превращаются в HTML-сущности.
 */
function e(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * Все записи (для списка posts/index.php, лаба 11).
 */
function getPosts(): array
{
    $stmt = db()->query('SELECT * FROM posts ORDER BY created_at DESC');
    return $stmt->fetchAll();
}

/**
 * Записи вместе с автором и категорией ОДНИМ SQL (лаба 12):
 * JOIN + пагинация LIMIT/OFFSET. Ограничения передаются как int-параметры.
 */
function getPostsWithMeta(int $page): array
{
    $perPage = POSTS_PER_PAGE;
    $offset  = max(0, ($page - 1) * $perPage);

    $stmt = db()->prepare(
        'SELECT p.id, p.title, p.content, p.created_at,
                u.username AS author_name, c.name    AS category_name
         FROM posts p
         JOIN users u      ON u.id = p.user_id
         JOIN categories c ON c.id = p.category_id
         WHERE p.status = "published"
         ORDER BY p.created_at DESC
         LIMIT ? OFFSET ?'
    );
    $stmt->bindValue(1, $perPage, PDO::PARAM_INT);
    $stmt->bindValue(2, $offset, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll();
}

/**
 * Общее число опубликованных записей (для расчёта числа страниц).
 */
function getTotalPostsCount(): int
{
    $stmt = db()->query('SELECT COUNT(*) FROM posts WHERE status = "published"');
    return (int) $stmt->fetchColumn();
}

/**
 * «N записей в категории X» для сайдбара: GROUP BY + COUNT.
 */
function getCategoryCounts(): array
{
    $stmt = db()->query(
        'SELECT c.name, c.slug, COUNT(p.id) AS cnt
         FROM categories c
         LEFT JOIN posts p ON p.category_id = c.id AND p.status = "published"
         GROUP BY c.id, c.name, c.slug
         ORDER BY c.name'
    );
    return $stmt->fetchAll();
}

/**
 * «Последние комментарии» в сайдбар: JOIN comments → posts.
 */
function getRecentComments(int $limit = 5): array
{
    $stmt = db()->prepare(
        'SELECT c.content, c.created_at, p.title AS post_title
         FROM comments c
         JOIN posts p ON p.id = c.post_id
         ORDER BY c.created_at DESC
         LIMIT ?'
    );
    $stmt->bindValue(1, $limit, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll();
}

/**
 * Полнотекстовый поиск по title/content (лаба 12, индекс из лабы 10).
 * Возвращает пустой массив, если индекс не создан.
 */
function searchPosts(string $q): array
{
    $stmt = db()->prepare(
        "SELECT p.id, p.title, p.content, p.created_at,
                u.username AS author_name, c.name    AS category_name
         FROM posts p
         JOIN users u      ON u.id = p.user_id
         JOIN categories c ON c.id = p.category_id
         WHERE p.status = 'published'
           AND MATCH(p.title, p.content) AGAINST (?)
         ORDER BY p.created_at DESC"
    );
    $stmt->execute([$q]);
    return $stmt->fetchAll();
}