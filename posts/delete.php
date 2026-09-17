<?php
// posts/delete.php — удаление записи.
// Лаб 11: принимает id записи (?id=... GET или поле в POST),
// проверяет существование, выполняет DELETE и делает редирект на список.
// ВАЖНО (лаба 14): удаление по кнопке из формы с подтверждением,
// без «удаления прямо по GET» без проверок.

require __DIR__ . '/../includes/header.php';

// TODO лаб 11: получите id, выполните DELETE FROM posts WHERE id = ?
// и верните пользователя на posts/index.php:  header('Location: index.php');
?>

<main class="post-form">
  <p>Удаление записи — реализуется в лабе 11.</p>
</main>

<?php require __DIR__ . '/../includes/footer.php'; ?>