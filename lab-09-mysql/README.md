# Лабораторная работа №9 — MySQL: первые таблицы и PDO

**Тема:** БД вместо PHP-массива.
**Цель:** создать базу `diary_db`, таблицу `posts`, подключиться из PHP через **PDO** и
вывести записи из MySQL на главную (заменить `getPosts()` на чтение из таблицы).

## Чек-лист

- [ ] Импортирован `database/schema.sql` (создаёт `diary_db`, таблицы `categories`, `posts`).
- [ ] `includes/db.php` — функция `db(): PDO` с DSN, `ERRMODE_EXCEPTION`, `FETCH_ASSOC`;
      параметры (host/name/user/pass) — через `getenv()`, `.env` в `.gitignore`.
- [ ] `getPosts()` в `includes/functions.php` теперь выполняет `SELECT * FROM posts
      ORDER BY created_at DESC` через PDO и возвращает массив строк.
- [ ] Ни одного пользовательского значения в SQL строкой (готовимся к лабам 11 и 14).
- [ ] Данные «прогоняются» через `e()` при выводе (наследие лабы 7).

## Теория + документация. обязательно прочитать

- PDO — единый API доступа к разным СУБД из PHP. Классы: `PDO`, `PDOStatement`, `PDOException`.
  https://www.php.net/manual/ru/class.pdo.php
- Строка подключения (DSN): `mysql:host=127.0.0.1;dbname=diary_db;charset=utf8mb4`.
  Тонкости: https://www.php.net/manual/ru/ref.pdo-mysql.connection.php
- Атрибуты: `PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION` — ошибки SQL бросают исключение;
  `PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC` — каждая строка — ассоциативный массив.
  https://www.php.net/manual/ru/pdo.setattribute.php
- `PDO::query()` для однократной выборки; `PDO::prepare()` + `execute()` для запросов с
  параметрами. https://www.php.net/manual/ru/pdo.query.php , https://www.php.net/manual/ru/pdo.prepare.php
- Зачем `charset=utf8mb4`? Поддержка эмодзи и кириллицы в полной широте.
  https://dev.mysql.com/doc/refman/8.0/en/charset-unicode-utf8mb4.html

## Пошагово

1. Импортируйте схему (phpMyAdmin: Import; или CLI):
   ```bash
   mysql -u root < database/schema.sql
   ```
2. Создайте `includes/db.php`:
   ```php
   <?php
   function db(): PDO
   {
       static $pdo = null;                     // одно подключение на весь запрос
       if ($pdo === null) {
           $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4',
               getenv('DB_HOST') ?: '127.0.0.1',
               getenv('DB_NAME') ?: 'diary_db');
           $pdo = new PDO($dsn, getenv('DB_USER') ?: 'root', getenv('DB_PASS') ?: '', [
               PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
               PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
           ]);
       }
       return $pdo;
   }
   ```
   В начале файла — `require __DIR__ . '/../.env.php';` если используете Dotenv-подобную
   загрузку, иначе берите из окружения терминала.
3. В `functions.php` подключите `db.php` и перепишите:
   ```php
   function getPosts(): array
   {
       $stmt = db()->query('SELECT * FROM posts ORDER BY created_at DESC');
       return $stmt->fetchAll();
   }
   ```
4. Заполните таблицу 5 своими записями (`INSERT`), запустите `php -S localhost:8000`
   и убедитесь, что записи из БД появились на странице.

## Самопроверка

- Что возвращает `fetch()` — строку? `fetchAll()` — что? Сколько запросов выполнит страница
  главной при 5 записях? (Правильный ответ — 1, потому что `query()` один.)
- Почему параметры подключения нельзя хардкодить в файле (см. лабу 14)?
- Что сломается, если забыть `charset=utf8mb4` при выводе кириллицы?

## Критерий «зачтено»

Главная выводит записи из таблицы `posts` через PDO; подключение — через `includes/db.php`;
`.env` не в git; запросов на главной — ровно один.

## Как отправить

```bash
cd diary-blog
git add .
git commit -m "[lab-09] MySQL+PDO: база, таблица posts, вывод из SELECT"
git tag lab-09 && git push && git push --tags
```

Сдаёте: `lab-09` + `https://github.com/<ваш логин>/diary-blog/tree/lab-09`.
