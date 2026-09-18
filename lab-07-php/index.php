<?php
/**
 * index.php — главная страница (лаба 7).
 * Записи из PHP-массива выводятся циклом, каждый вывод экранирован e().
 */

require __DIR__ . '/includes/functions.php';

$pageTitle = 'Главная';
require __DIR__ . '/includes/header.php';

$posts = getPosts();
?>
<main class="layout">
  <section class="posts">
    <h2>Последние записи</h2>

    <?php if (count($posts) === 0): ?>
      <p class="empty">Записей пока нет.</p>
    <?php endif; ?>

    <?php foreach ($posts as $post): ?>
      <article class="post">
        <h3><?= e($post['title']) ?></h3>
        <time datetime="<?= e($post['date']) ?>"><?= e($post['date']) ?></time>
        <p><?= e($post['content']) ?></p>
        <span class="category"><?= e($post['category']) ?></span>
      </article>
    <?php endforeach; ?>
  </section>

  <aside>
    <h2>Категории</h2>
    <!-- TODO лаба 8: категории начнём выводить из данных -->
  </aside>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>