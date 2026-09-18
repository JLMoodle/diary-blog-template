<?php
/**
 * posts/view.php — одна запись по id (лаба 11).
 * Если записи нет — честная страница 404.
 */

require dirname(__DIR__) . '/includes/functions.php';

$id   = (int) ($_GET['id'] ?? 0);
$post = getPost($id);

if ($post === null) {
    http_response_code(404);
    $pageTitle = 'Не найдено';
    require dirname(__DIR__) . '/includes/header.php';
    echo '<main class="layout"><section><h2>Запись не найдена</h2>';
    echo '<p><a href="index.php">К списку записей</a></p></section></main>';
    require dirname(__DIR__) . '/includes/footer.php';
    exit;
}

$pageTitle = $post['title'];
require dirname(__DIR__) . '/includes/header.php';
?>
<main class="layout">
  <section>
    <article class="post">
      <h2><?= e($post['title']) ?></h2>
      <time datetime="<?= e($post['created_at']) ?>"><?= e($post['created_at']) ?></time>
      <p><?= nl2br(e($post['content'])) ?></p>
      <p>
        <a href="edit.php?id=<?= (int) $post['id'] ?>">Изменить</a>
        · <a href="delete.php?id=<?= (int) $post['id'] ?>">Удалить</a>
        · <a href="index.php">К списку</a>
      </p>
    </article>
  </section>
</main>
<?php require dirname(__DIR__) . '/includes/footer.php'; ?>