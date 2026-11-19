<?php
/**
 * index.php — главная страница (лаба 7).
 * Записи из PHP-массива выводятся циклом, каждый вывод экранирован e().
 */

require __DIR__ . '/includes/functions.php';

$pageTitle = 'Главная — Мой дневник';
require __DIR__ . '/includes/header.php';

$posts = getPosts();
$categoryCounts = array_count_values(array_column($posts, 'category'));
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
        <p class="post-meta">
          <time datetime="<?= e($post['date']) ?>"><?= e(date('d.m.Y', strtotime($post['date']))) ?></time>
          <span class="tag"><?= e(categoryLabel($post['category'])) ?></span>
          <span><?= e($post['author']) ?></span>
        </p>
        <p><?= e($post['content']) ?></p>
      </article>
    <?php endforeach; ?>
  </section>

  <aside>
    <h2>Категории</h2>
    <ul>
      <?php foreach ($categoryCounts as $category => $count): ?>
        <li>
          <a href="#">
            <?= e(categoryLabel($category)) ?>
            <span class="count"><?= e((string) $count) ?></span>
          </a>
        </li>
      <?php endforeach; ?>
    </ul>
  </aside>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
