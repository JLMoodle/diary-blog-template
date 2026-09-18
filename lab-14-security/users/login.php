<?php
/**
 * users/login.php — вход (лаба 14).
 * Пароль сверяется password_verify() с хэшем из БД.
 * При неудаче — ОДНА общая ошибка (не выдаём, что именно неверно).
 */

require dirname(__DIR__) . '/includes/functions.php';

$pageTitle = 'Вход';
require dirname(__DIR__) . '/includes/header.php';

$error = null;
$old = ['email' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();

    $old['email'] = trim($_POST['email'] ?? '');
    $password     = $_POST['password'] ?? '';

    $user = findUserByEmail($old['email']);

    if ($user !== null && password_verify($password, $user['password_hash'])) {
        session_regenerate_id(true); // защита от фиксации сессии
        $_SESSION['user_id'] = (int) $user['id'];
        header('Location: /index.php');
        exit;
    }

    $error = 'Неверный логин или пароль';
}
?>
<main class="layout">
  <section>
    <h2>Вход</h2>

    <?php if ($error !== null): ?>
      <p class="flash flash-error"><?= e($error) ?></p>
    <?php endif; ?>

    <form action="" method="post" novalidate>
      <?= csrf_field() ?>

      <div class="frm-row">
        <label for="email">E-mail</label>
        <input type="email" id="email" name="email" value="<?= e($old['email']) ?>">
      </div>

      <div class="frm-row">
        <label for="password">Пароль</label>
        <input type="password" id="password" name="password">
      </div>

      <button type="submit">Войти</button>
    </form>
  </section>
</main>
<?php require dirname(__DIR__) . '/includes/footer.php'; ?>