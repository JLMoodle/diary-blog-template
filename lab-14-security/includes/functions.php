<?php
/**
 * includes/functions.php — вспомогательные функции (лабы 7–14).
 * Здесь же: работа с БД (лабы 11–12), сессии и CSRF (лаба 14).
 */

require_once __DIR__ . '/db.php';

// Сессия нужна и для авторизации, и для CSRF — запускаем ДО любого вывода.
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/** Записей на страницу (пагинация, лаба 12). */
const POSTS_PER_PAGE = 5;

/**
 * Экранирование вывода: спецсимволы превращаются в HTML-сущности.
 * ВЕСЬ вывод пользовательских данных — только через e() (XSS, лаба 14).
 */
function e(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

/* ---------- Выборки (лабы 11–12) ---------- */

function getPosts(): array
{
    $stmt = db()->query('SELECT * FROM posts ORDER BY created_at DESC');
    return $stmt->fetchAll();
}

function getPost(int $id): ?array
{
    $stmt = db()->prepare('SELECT * FROM posts WHERE id = ?');
    $stmt->execute([$id]);
    $post = $stmt->fetch();
    return $post ?: null;
}

/**
 * Записи с автором и категорией ОДНИМ SQL: JOIN + пагинация.
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

function getTotalPostsCount(): int
{
    $stmt = db()->query('SELECT COUNT(*) FROM posts WHERE status = "published"');
    return (int) $stmt->fetchColumn();
}

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

/* ---------- Пользователи и сессии (лаба 14) ---------- */

function findUserByEmail(string $email): ?array
{
    $stmt = db()->prepare('SELECT id, username, email, password_hash FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    return $user ?: null;
}

function isLoggedIn(): bool
{
    return isset($_SESSION['user_id']);
}

function currentUserId(): ?int
{
    return isLoggedIn() ? (int) $_SESSION['user_id'] : null;
}

/* ---------- CSRF (лаба 14) ---------- */

function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrf_field(): string
{
    return '<input type="hidden" name="csrf_token" value="' . e(csrf_token()) . '">';
}

function verify_csrf(): bool
{
    $sent   = $_POST['csrf_token'] ?? '';
    $stored = $_SESSION['csrf_token'] ?? '';
    return $stored !== '' && hash_equals($stored, $sent);
}

function require_csrf(): void
{
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && !verify_csrf()) {
        http_response_code(403);
        echo 'CSRF-проверка не пройдена.';
        exit;
    }
}

function require_login(): void
{
    if (!isLoggedIn()) {
        header('Location: /users/login.php');
        exit;
    }
}