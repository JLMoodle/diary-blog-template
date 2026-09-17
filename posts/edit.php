<?php
// posts/edit.php — редактирование существующей записи.
// Лаб 11: форма уже заполнена данными записи (?id=...), UPDATE по id.

require __DIR__ . '/../includes/header.php';

// Лаб 11: читаем $id = $_GET['id'] ?? 0; выбираем запись из БД,
// подставляем значения в атрибуты value и textarea.
?>

<main class="post-form">
  <h2>Редактирование записи</h2>
  <form action="edit.php" method="post">
    <input type="hidden" name="id" value="">

    <label>
      Заголовок
      <input type="text" name="title" required>
    </label>

    <label>
      Категория
      <select name="category_id"><!-- опции категорий --></select>
    </label>

    <label>
      Текст записи
      <textarea name="content" rows="10" required></textarea>
    </label>

    <button type="submit">Сохранить</button>
  </form>
</main>

<?php require __DIR__ . '/../includes/footer.php'; ?>