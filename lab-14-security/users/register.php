<?php
/**
 * users/register.php — регистрация (лаба 14).
 * Пароль хранится ТОЛЬКО через password_hash() (никогда не в открытом виде).
 */

require dirname(__DIR__) . '/includes/functions.php';

$pageTitle = 'Регистрация';
require dirname(__DIR__) . '/includes/header.php';

$errors = [];
$old = ['username' => '', 'email' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();

    $old['username'] = trim($_POST['username'] ?? '');
    $old['email']    = trim($_POST['email'] ?? '');
    $password        = $_POST['password'] ?? '';
    $confirm         = $_POST['password_confirm'] ?? '';

    if (mb_strlen($old['username']) < 3) {
        $errors['username'] = 'Логин — минимум 3 символа';
    }
    if (!filter_var($old['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Некорректный e-mail';
    }
    if (strlen($password) < 8) {
        $errors['password'] = 'Пароль — минимум 8 символов';
    }
    if ($password !== $confirm) {
        $errors['password_confirm'] = 'Пароли не совпадают';
    }

    // И логин, и e-mail уникальны — проверяем ДО вставки.
    if (!isset($errors['email']) && findUserByEmail($old['email']) !== null) {
        $errors['email'] = 'Этот e-mail уже зарегистрирован';
    }

    if (count($errors) === 0) {
        $hash = password_hash($password, PASSWORD_DEFAULT);

        $stmt = db()->prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)');
        $stmt->execute([$old['username'], $old['email'], $hash]);

        header('Location: login.php');
        exit;
    }
}
?>
<main class="layout">
  <section>
    <h2>Регистрация</h2>

    <form action="" method="post" novalidate>
      <?= csrf_field() ?>

      <div class="frm-row">
        <label for="username">Логин</label>
        <input type="text" id="username" name="username" value="<?= e($old['username']) ?>">
        <?php if (isset($errors['username'])): ?>
          <p class="error"><?= e($errors['username']) ?></p>
        <?php endif; ?>
      </div>

      <div class="frm-row">
        <label for="email">E-mail</label>
        <input type="email" id="email" name="email" value="<?= e($old['email']) ?>">
        <?php if (isset($errors['email'])): ?>
          <p class="error"><?= e($errors['email']) ?></p>
        <?php endif; ?>
      </div>

      <div class="frm-row">
        <label for="password">Пароль</label>
        <input type="password" id="password" name="password">
        <?php if (isset($errors['password'])): ?>
          <p class="error"><?= e($errors['password']) ?></p>
        <?php endif; ?>
      </div>

      <div class="frm-row">
        <label for="password_confirm">Пароль ещё раз</label>
        <input type="password" id="password_confirm" name="password_confirm">
        <?php if (isset($errors['password_confirm'])): ?>
          <p class="error"><?= e($errors['password_confirm']) ?></p>
        <?php endif; ?>
      </div>

      <button type="submit">Зарегистрироваться</button>
    </form>
  </section>
</main>
<?php require dirname(__DIR__) . '/includes/footer.php'; ?>