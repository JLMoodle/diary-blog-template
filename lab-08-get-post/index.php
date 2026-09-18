<?php
/**
 * index.php — главная с поиском через GET (лаба 8).
 *
 * Пользовательское значение `q` выводится ТОЛЬКО через e().
 */

require __DIR__ . '/includes/functions.php';

$pageTitle = 'Главная';
require __DIR__ . '/includes/header.php';

$q = trim($_GET['q'] ?? '');
$posts = getPosts();

if ($q !== '') {
    $posts = array_filter($posts, function ($post) use ($q) {
        return mb_stripos($post['title'], $q) !== false
            || mb_stripos($post['content'], $q) !== false;
    });
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
        <time datetime="<?= e($post['date']) ?>"><?= e($post['date']) ?></time>
        <p><?= e($post['content']) ?></p>
        <span class="category"><?= e($post['category']) ?></span>
      </article>
    <?php endforeach; ?>
  </section>

  <aside>
    <h2>Категории</h2>
    <ul>
      <?php foreach (getCategories() as $category): ?>
        <li>
          <a href="index.php?q=<?= e($category) ?>"><?= e($category) ?></a>
        </li>
      <?php endforeach; ?>
    </ul>
  </aside>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>