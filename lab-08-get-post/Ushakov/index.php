<?php
require __DIR__ . '/includes/functions.php';

$pageTitle = 'Главная';
require __DIR__ . '/includes/header.php';

$posts = getPosts();

$q = trim($_GET['q'] ?? '');
if ($q !== '') {
    $posts = array_filter($posts, function (array $post) use ($q): bool {
        return mb_stripos($post['title'], $q) !== false
            || mb_stripos($post['content'], $q) !== false;
    });
}

?>
<main class="layout">
  <section class="posts">
    <h2>Последние записи</h2>

    <form action="index.php" method="get">
  <input type="text" name="q" value="<?= e($_GET['q'] ?? '') ?>">
  <button>Поиск</button>
</form>

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
  </aside>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>