<?php
/**
 * index.php — главная с JOIN, счётчиками категорий, поиском через FULLTEXT
 * и пагинацией (лаба 12). Фильтры (q, page) не теряются между страницами.
 */

require __DIR__ . '/includes/functions.php';

$pageTitle = 'Главная';
require __DIR__ . '/includes/header.php';

$page = max(1, (int) ($_GET['page'] ?? 1));
$q    = trim($_GET['q'] ?? '');

if ($q !== '') {
    $posts = searchPosts($q);
    $total = count($posts);
    $pages = 1;
} else {
    $posts = getPostsWithMeta($page);
    $total = getTotalPostsCount();
    $pages = max(1, (int) ceil($total / POSTS_PER_PAGE));
}

$categoryCounts = getCategoryCounts();
$recentComments = getRecentComments();

// Строка запроса для сохранения фильтров в ссылках пагинации.
$queryBase = $q !== '' ? '&q=' . rawurlencode($q) : '';
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
        <h3><a href="posts/view.php?id=<?= (int) $post['id'] ?>"><?= e($post['title']) ?></a></h3>
        <time datetime="<?= e($post['created_at']) ?>"><?= e($post['created_at']) ?></time>
        <p><?= e(mb_strimwidth($post['content'], 0, 200, '…')) ?></p>
        <span class="category"><?= e($post['category_name'] ?? '') ?> · <?= e($post['author_name'] ?? '') ?></span>
      </article>
    <?php endforeach; ?>

    <?php if ($pages > 1): ?>
      <nav class="pagination">
        <?php if ($page > 1): ?>
          <a href="?page=<?= $page - 1 ?><?= $queryBase ?>">‹ Назад</a>
        <?php endif; ?>

        <?php for ($i = 1; $i <= $pages; $i++): ?>
          <?php if ($i === $page): ?>
            <span class="page"><?= $i ?></span>
          <?php else: ?>
            <a href="?page=<?= $i ?><?= $queryBase ?>"><?= $i ?></a>
          <?php endif; ?>
        <?php endfor; ?>

        <?php if ($page < $pages): ?>
          <a href="?page=<?= $page + 1 ?><?= $queryBase ?>">Вперёд ›</a>
        <?php endif; ?>
      </nav>
    <?php endif; ?>
  </section>

  <aside>
    <h2>Категории</h2>
    <ul>
      <?php foreach ($categoryCounts as $category): ?>
        <li>
          <a href="index.php?q=<?= e($category['slug']) ?>">
            <?= e($category['name']) ?> (<?= (int) $category['cnt'] ?>)
          </a>
        </li>
      <?php endforeach; ?>
    </ul>

    <?php if (count($recentComments) > 0): ?>
      <h2 style="margin-top: 1rem">Комментарии</h2>
      <ul>
        <?php foreach ($recentComments as $comment): ?>
          <li>
            <small><?= e($comment['content']) ?></small>
            <br>
            <em><?= e($comment['post_title']) ?></em>
          </li>
        <?php endforeach; ?>
      </ul>
    <?php endif; ?>
  </aside>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>