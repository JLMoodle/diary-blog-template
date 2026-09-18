<?php
/**
 * index.php — главная (лаба 11). Просто список последних записей.
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
      <p class="empty">Записей пока нет. <a href="posts/add.php">Добавьте первую</a>.</p>
    <?php endif; ?>

    <?php foreach ($posts as $post): ?>
      <article class="post">
        <h3><?= e($post['title']) ?></h3>
        <time datetime="<?= e($post['created_at']) ?>"><?= e($post['created_at']) ?></time>
        <p><?= e(mb_strimwidth($post['content'], 0, 200, '…')) ?></p>
        <p>
          <a class="read-more" href="posts/view.php?id=<?= (int) $post['id'] ?>">Читать</a>
          · <a href="posts/edit.php?id=<?= (int) $post['id'] ?>">Изменить</a>
          · <a href="posts/delete.php?id=<?= (int) $post['id'] ?>">Удалить</a>
        </p>
      </article>
    <?php endforeach; ?>
  </section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>