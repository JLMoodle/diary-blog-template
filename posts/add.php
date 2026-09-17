<?php
// posts/add.php — форма создания новой записи.
// Лаб 8: POST-обработка формы + серверная валидация.
// Лаб 11: INSERT в таблицу posts через подготовленный запрос.

require __DIR__ . '/../includes/header.php';
?>

<main class="post-form">
  <h2>Новая запись</h2>
  <form action="add.php" method="post">
    <label>
      Заголовок
      <input type="text" name="title" required minlength="3">
    </label>

    <label>
      Категория
      <select name="category_id">
        <!-- Опции категорий: с лабы 9 — из таблицы categories -->
      </select>
    </label>

    <label>
      Текст записи
      <textarea name="content" rows="10" required></textarea>
    </label>

    <button type="submit">Опубликовать</button>
  </form>

  <?php
  // Лаб 8: обработка $_POST и вывод ошибок/успеха валидации.
  ?>
</main>

<?php require __DIR__ . '/../includes/footer.php'; ?>