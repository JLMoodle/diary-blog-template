<?php
/**
 * posts/index.php — список всех записей из БД (лаба 11).
 */

require dirname(__DIR__) . '/includes/functions.php';

$pageTitle = 'Все записи';
require dirname(__DIR__) . '/includes/header.php';

$posts = getPosts();
?>
<main class="layout">
  <section class="posts">
    <h2>Все записи</h2>

    <p><a class="btn" href="add.php">Новая запись</a></p>

    <?php if (count($posts) === 0): ?>
      <p class="empty">Записей пока нет.</p>
    <?php endif; ?>

    <?php foreach ($posts as $post): ?>
      <article class="post">
        <h3><?= e($post['title']) ?></h3>
        <time datetime="<?= e($post['created_at']) ?>"><?= e($post['created_at']) ?></time>
        <p><?= e(mb_strimwidth($post['content'], 0, 200, '…')) ?></p>
        <p>
          <a class="read-more" href="view.php?id=<?= (int) $post['id'] ?>">Читать</a>
          · <a href="edit.php?id=<?= (int) $post['id'] ?>">Изменить</a>
          · <a href="delete.php?id=<?= (int) $post['id'] ?>">Удалить</a>
        </p>
      </article>
    <?php endforeach; ?>
  </section>
</main>
<?php require dirname(__DIR__) . '/includes/footer.php'; ?>