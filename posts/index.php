<?php
// posts/index.php — список записей блога.
// Лаб 7: замените include на include/index.php (до этого файл называется index.html).
// Лаб 9: записи выбираются из MySQL, а не из массива.
// Собирается из includes/header.php + разметка записей + includes/footer.php.

require __DIR__ . '/../includes/header.php';
?>

<main>
  <section class="posts-list">
    <h2>Последние записи</h2>
    <?php
    // Лаб 7: здесь выводятся записи (foreach по массиву записей)
    // Лаб 9: записи приходят из БД (SELECT ... ORDER BY created_at DESC)
    ?>
  </section>

  <aside>
    <h2>Категории</h2>
    <!-- Список категорий (с лабы 9–10 — из таблицы categories) -->
  </aside>
</main>

<?php require __DIR__ . '/../includes/footer.php'; ?>