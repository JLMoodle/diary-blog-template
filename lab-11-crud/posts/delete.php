<?php
/**
 * posts/delete.php — удаление записи (DELETE, лаба 11).
 * Удаление — НЕ простая ссылка (GET), а отдельная страница-подтверждение
 * с POST-формой: изменение состояния должно идти через POST, а не через
 * GET-переход (префетч/поисковик/F5 без спроса «дёрнут» ссылку).
 */

require dirname(__DIR__) . '/includes/functions.php';

$id = (int) ($_GET['id'] ?? 0);

$pageTitle = 'Удаление';
require dirname(__DIR__) . '/includes/header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $stmt = db()->prepare('DELETE FROM posts WHERE id = ?');
    $stmt->execute([$id]);

    header('Location: index.php');
    exit;
}

$post = getPost($id);
if ($post === null) {
    http_response_code(404);
    echo '<main class="layout"><h2>Запись не найдена</h2></main>';
    require dirname(__DIR__) . '/includes/footer.php';
    exit;
}
?>
<main class="layout">
  <section>
    <h2>Удалить запись?</h2>
    <p>
      «<?= e($post['title']) ?>»
      удалится безвозвратно. Точно удалить?
    </p>

    <form action="delete.php?id=<?= (int) $post['id'] ?>" method="post">
      <button class="btn-danger" type="submit">Удалить</button>
      <a class="btn" href="view.php?id=<?= (int) $post['id'] ?>">Отмена</a>
    </form>
  </section>
</main>
<?php require dirname(__DIR__) . '/includes/footer.php'; ?>