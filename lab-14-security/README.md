# Лабораторная работа №14 — Безопасность: XSS, SQL-инъекции, CSRF, пароли

## Как работать в этой лабе (общий репозиторий группы)

В этой папке `lab-14-security/` вы создаёте свою подпапку по фамилии и ведёте код только в ней.

1. Перед началом работы забрать чужие правки: `git pull --rebase`.
2. Создать свою подпапку: `mkdir lab-14-security/<Фамилия>` (латиницей, например `kimsan`).
3. Скопировать скелет лабы **целой папкой** в свою подпапку, чтобы не сломались
   относительные пути (`css/`, `js/`, `data/`, `includes/`).
4. Правите только своё; чужие подпапки и скелеты не трогайте.
5. Сдача лабы — см. раздел «Как отправить» в конце этого файла.


**Тема:** лучшие практики защиты веб-приложения.
**Цель:** закрыть типичные уязвимости блога и объяснить, как они работают, — показать
преподавателю, что вы не просто доливаете код, а понимаете, что защищаете.

## Чек-лист

- [ ] **XSS:** ВЕСЬ вывод — через `e()` (экранирование уже сделано в лабах 7–8). Проверка:
      вставляете `<script>alert(1)</script>` как текст записи — на странице он НЕ выполняется.
- [ ] **SQL-инъекции:** в проекте нет ни одной конкатенации значения в SQL-строку; всё —
      prepared statements (лабы 9, 11 повторены). Проверка: подставляете `' OR 1=1 --` в поиск
      — поиск НЕ возвращает все записи.
- [ ] **CSRF:** каждая POST-форма содержит скрытое поле `csrf_token`; на сервере перед
      обработкой POST — `verify_csrf()`; при неудаче — `http_response_code(403)`. Для GET-действий
      (запросы, пагинация) токен не нужен.
- [ ] **Пароли:** хранение только через `password_hash()` (никогда не текстом и не md5);
      проверка — `password_verify()`. В `users` есть колонка `password_hash`.
- [ ] **`.env` вне git:** `.env` в `.gitignore`, секреты читаются через `getenv()` (лаба 9);
      в README написан шаблон `.env.example`.
- [ ] **Сессии:** `session_start()` в header; после входа — `$_SESSION['user_id']`;
      авторизация не через спрятанную ссылку, а через `login.php` + `password_verify`.

## Теория + документация

- **XSS (Cross-Site Scripting):** инъекция скрипта в чужую страницу. Виды: stored/reflected/DOM.
  https://owasp.org/www-community/attacks/xss/
- **SQL-инъекция:** подмена части запроса через ввод; классика — `' OR 1=1 --`.
  https://owasp.org/www-community/attacks/SQL_Injection
- **CSRF (Cross-Site Request Forgery):** злоумышленник заставляет браузер жертвы выполнить
  действие на вашем сайте (картинка `<img src=".../delete.php?id=5">`, форма на чужом сайте).
  Продолжение с кодами — в лабе 15; сюда — ссылку:
  https://owasp.org/www-community/attacks/csrf
- **Синхронизация токенов (синоним CSRF-токена) — паттерн «двойной передачи», простое и
  прочное решение:** https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- **Хеширование паролей** `password_hash()`/`password_verify()` (bcrypt), про «почему нельзя md5»:
  https://www.php.net/manual/ru/function.password-hash.php
  и https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- **Почему не доверяем и «своим» данным:** даже данные из БД могли прийти из формы
  (лаба 8) — вывод всегда экранируем. https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html

## Ход работы

1. `includes/functions.php`: добавьте три функции CSRF (сессия уже запущена в начале
   `functions.php` — см. шаг 2):
   ```php
   function csrf_token(): string
   {
       if (empty($_SESSION['csrf_token'])) {
           $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
       }
       return $_SESSION['csrf_token'];
   }

   function csrf_field(): string
   {
       echo '<input type="hidden" name="csrf_token" value="' . e(csrf_token()) . '">';
   }

   function verify_csrf(): bool
   {
       $sent   = $_POST['csrf_token'] ?? '';
       $stored = $_SESSION['csrf_token'] ?? '';
       return $stored !== '' && hash_equals($stored, $sent);
   }
   ```
2. `session_start();` — в самом начале `includes/functions.php` (до любого вывода).
   Важно: обработка POST в `add.php`/`edit.php`/`delete.php` идёт **до** `require header.php`,
   поэтому сессия должна стартовать при подключении функций, а не в шапке.
3. В каждую POST-форму после открытия: `<?php csrf_field(); ?>`.
4. В начале обработчика POST любого файла (после подключения `functions.php`):
   ```php
   if ($_SERVER['REQUEST_METHOD'] === 'POST' && !verify_csrf()) {
       http_response_code(403);
       echo 'CSRF-проверка не пройдена.';
       exit;
   }
   ```
5. `users/register.php`: форма (username, email, password, password_confirm) → валидация
   (email валидный; password ≥ 8 символов и совпадают; username ≥ 3) → если ок:
   ```php
   $hash = password_hash($password, PASSWORD_DEFAULT);
   $stmt = db()->prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)');
   $stmt->execute([$username, $email, $hash]);
   header('Location: login.php'); exit;
   ```
6. `users/login.php`: форма → `SELECT id, password_hash FROM users WHERE email = ?` →
   `password_verify($password, $row['password_hash'])` → `$_SESSION['user_id'] = $row['id'];`
   → редирект на главную. Иначе — общая ошибка «Неверный логин или пароль» (не выдавать,
   что именно неверно).
7. Прогоните атаки из чек-листа — убедитесь, что «не проходят».

## Самопроверка

- Почему `e()` нужен даже для полей, которые «заполняете только вы»?
- Почему `md5($password)` — плохо, даже если аккаунтов 3?
- Что произойдёт при CSRF-атаке через `<img src=".../delete.php?id=5">`, если у вас сохранён
  редирект с подтверждением POST (лаба 11)? А если бы действие было прямой GET-ссылкой?
- Почему на страницы поиска/пагинации (GET) токен не нужен?

## Критерий «зачтено»

- Всё, что выводится, — через `e()`; все выборки — prepared; в POST-формах токен проверяется;
  пароли — `password_hash`/`password_verify`; `register.php`/`login.php` работают;
  секреты читаются из `.env`, которого нет в git. В README — описание, какой уязвимости
  вы больше всего боялись и как закрыли.

## Как отправить (протокол курса)

Сдача лабы = ваша подпапка `<Фамилия>/` в main **общего** репозитория.

```bash
git add lab-14-security/<Фамилия>/
git commit -m "[lab-14] <Фамилия>: <что сделано>"
git pull --rebase
git push
```

Отправьте преподавателю одну строку: `Сдаю: lab-14` + ссылку на вашу папку
`https://github.com/JLMoodle/diary-blog-template/tree/main/lab-14-security/<Фамилия>`.

> Теги `lab-NN` и `v1.0` в шаблоне — вехи курса, их ставит преподаватель.
> Студенты личные теги на сдачу не ставят.
