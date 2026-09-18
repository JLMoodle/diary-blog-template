<?php
/**
 * posts/add.php — создание записи (INSERT, лаба 11).
 * PRG: после успешного INSERT — редирект на view, чтобы F5 не плодил дубли.
 */

require dirname(__DIR__) . '/includes/functions.php';

$pageTitle = 'Новая запись';
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
        // Значения подставляются только параметрами — без SQL-инъекций.
        $stmt = db()->prepare('INSERT INTO posts (title, content) VALUES (?, ?)');
        $stmt->execute([$old['title'], $old['content']]);

        $newId = (int) db()->lastInsertId();
        header('Location: view.php?id=' . $newId);
        exit;
    }
}
?>
<main class="layout">
  <section>
    <h2>Новая запись</h2>

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

      <button type="submit">Опубликовать</button>
    </form>
  </section>
</main>
<?php require dirname(__DIR__) . '/includes/footer.php'; ?>