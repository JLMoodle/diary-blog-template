<?php
require_once __DIR__ . '/db.php';
function e(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

function getCategories(): array
{
    return ['study', 'projects', 'tech'];
}

function getPosts(): array
{
    $stmt = db()->query(
        'SELECT * FROM posts ORDER BY created_at DESC'
    );

    return $stmt->fetchAll();
}