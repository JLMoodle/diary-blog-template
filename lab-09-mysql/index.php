<?php
/**
 * index.php — главная страница (лаба 9).
 * Записи теперь читаются из таблицы posts через PDO.
 */

require __DIR__ . '/includes/functions.php';

$pageTitle = 'Главная';
require __DIR__ . '/includes/header.php';

$q = trim($_GET['q'] ?? '');

if ($q !== '') {
    // Значение пользователя подставляется ТОЛЬКО параметром (prepared statement).
    $stmt  = db()->prepare('SELECT * FROM posts WHERE title LIKE ? OR content LIKE ? ORDER BY created_at DESC');
    $like  = '%' . $q . '%';
    $stmt->execute([$like, $like]);
    $posts = $stmt->fetchAll();
} else {
    $posts = getPosts();
}
?>
<main class="layout">
  <section class="posts">
    <h2>Последние записи</h2>

    <form action="index.php" method="get">
      <div class="frm-row">
        <input type="text" name="q" value="<?= e($q) ?>" placeholder="Поиск по записям…">
        <button type="submit">Поиск</button>
      </div>
    </form>

    <?php if (count($posts) === 0): ?>
      <p class="empty">Записей не найдено.</p>
    <?php endif; ?>

    <?php foreach ($posts as $post): ?>
      <article class="post">
        <h3><?= e($post['title']) ?></h3>
        <time datetime="<?= e($post['created_at']) ?>"><?= e($post['created_at']) ?></time>
        <p><?= e($post['content']) ?></p>
      </article>
    <?php endforeach; ?>
  </section>

  <aside>
    <h2>Категории</h2>
    <!-- TODO лаба 12: категории с количеством записей (GROUP BY) -->
    <ul>
      <?php foreach (getCategories() as $category): ?>
        <li><a href="index.php?q=<?= e($category) ?>"><?= e($category) ?></a></li>
      <?php endforeach; ?>
    </ul>
  </aside>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>