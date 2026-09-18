<?php
/**
 * posts/add.php — форма добавления записи (лаба 8).
 * Форма отправляется методом POST «на саму себя» (action=""),
 * обработка и вывод — в одном файле. После успеха — редирект (PRG),
 * чтобы повторное обновление (F5) не создавало дубликат.
 */

require dirname(__DIR__) . '/includes/functions.php';

$pageTitle = 'Новая запись';
require dirname(__DIR__) . '/includes/header.php';

$errors = [];
$old = ['title' => '', 'category' => '', 'content' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $old['title']    = trim($_POST['title'] ?? '');
    $old['category'] = $_POST['category'] ?? '';
    $old['content']  = trim($_POST['content'] ?? '');

    // Валидация на сервере
    if (mb_strlen($old['title']) < 3) {
        $errors['title'] = 'Заголовок — минимум 3 символа';
    }
    if (!in_array($old['category'], getCategories(), true)) {
        $errors['category'] = 'Выберите категорию из списка';
    }
    if (mb_strlen($old['content']) < 20) {
        $errors['content'] = 'Текст — минимум 20 символов';
    }

    if (count($errors) === 0) {
        // Демо: в лабах 9–11 запись будет сохраняться в БД.
        // Сейчас добавим во временный массив и сразу редирект (PRG).
        $posts = getPosts();
        $posts[] = [
            'id'       => count($posts) + 1,
            'title'    => $old['title'],
            'content'  => $old['content'],
            'category' => $old['category'],
            'date'     => date('Y-m-d'),
        ];
        header('Location: ../index.php');
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
        <label for="category">Категория</label>
        <select id="category" name="category">
          <option value="">— выберите —</option>
          <?php foreach (getCategories() as $category): ?>
            <option value="<?= e($category) ?>" <?= $old['category'] === $category ? 'selected' : '' ?>>
              <?= e($category) ?>
            </option>
          <?php endforeach; ?>
        </select>
        <?php if (isset($errors['category'])): ?>
          <p class="error"><?= e($errors['category']) ?></p>
        <?php endif; ?>
      </div>

      <div class="frm-row">
        <label for="content">Текст записи</label>
        <textarea id="content" name="content" rows="6"><?= e($old['content']) ?></textarea>
        <?php if (isset($errors['content'])): ?>
          <p class="error"><?= e($errors['content']) ?></p>
        <?php endif; ?>
      </div>

      <button type="submit">Опубликовать</button>
    </form>
  </section>
</main>
<?php require dirname(__DIR__) . '/includes/footer.php'; ?>