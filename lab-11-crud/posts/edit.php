<?php
/**
 * posts/edit.php — редактирование записи (UPDATE, лаба 11).
 * GET: форма предзаполнена данными из БД (или из $_POST после ошибки).
 * POST: UPDATE по id и редирект на view (PRG).
 */

require dirname(__DIR__) . '/includes/functions.php';

$id = (int) ($_GET['id'] ?? 0);

$pageTitle = 'Редактирование';
require dirname(__DIR__) . '/includes/header.php';

$errors = [];
$old = ['title' => '', 'content' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $old['title']   = trim($_POST['title'] ?? '');
    $old['content'] = trim($_POST['content'] ?? '');

    if (mb_strlen($old['title']) < 3) {
        $errors['title'] = 'Заголовок — минимум 3 символа';
    }
    if (mb_strlen($old['content']) < 20) {
        $errors['content'] = 'Текст — минимум 20 символов';
    }

    if (count($errors) === 0) {
        $stmt = db()->prepare('UPDATE posts SET title = ?, content = ? WHERE id = ?');
        $stmt->execute([$old['title'], $old['content'], $id]);

        header('Location: view.php?id=' . $id);
        exit;
    }
} else {
    $post = getPost($id);
    if ($post === null) {
        http_response_code(404);
        echo '<main class="layout"><h2>Запись не найдена</h2></main>';
        require dirname(__DIR__) . '/includes/footer.php';
        exit;
    }
    $old['title']   = $post['title'];
    $old['content'] = $post['content'];
}
?>
<main class="layout">
  <section>
    <h2>Редактирование записи</h2>

    <form action="" method="post" novalidate>
      <div class="frm-row">
        <label for="title">Заголовок</label>
        <input type="text" id="title" name="title" value="<?= e($old['title']) ?>">
        <?php if (isset($errors['title'])): ?>
          <p class="error"><?= e($errors['title']) ?></p>
        <?php endif; ?>
      </div>

      <div class="frm-row">
        <label for="content">Текст записи</label>
        <textarea id="content" name="content" rows="8"><?= e($old['content']) ?></textarea>
        <?php if (isset($errors['content'])): ?>
          <p class="error"><?= e($errors['content']) ?></p>
        <?php endif; ?>
      </div>

      <button type="submit">Сохранить</button>
    </form>
  </section>
</main>
<?php require dirname(__DIR__) . '/includes/footer.php'; ?>