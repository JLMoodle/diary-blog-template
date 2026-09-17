# Лабораторная работа №9 — PHP + MySQL. Подключение базы данных

**Тема:** хранение записей в базе данных.
**Цель:** создать БД `diary_db`, подключиться через PDO и выводить записи из таблицы вместо PHP-массива.

## Краткая теория
- **MySQL** — сервер БД; **PDO** — универсальный драйвер доступа из PHP.
- Таблица = «таблица в Excel»: столбцы с **типами** (`INT`, `VARCHAR`, `TEXT`, `TIMESTAMP`), строки — записи.
- Безопасное чтение с параметром: `SELECT * FROM posts WHERE id = ?` через prepared statement (почему — в лабе 14).
- Параметры подключения — секреты: **не писать в коде**. Вынести в `.env` (скопировать из `.env.example`) и читать через `getenv()` либо функцию-хелпер.
- Инструменты: phpMyAdmin, MySQL CLI (`mysql -u root -p`), редактор.

## Ход работы
1. Импортируйте начальную схему (сейчас в ней нужны таблицы `posts` и `categories` адаптированные; полная схема из `database/schema.sql` разберётся в лабе 10). Можно начать с урезанной версии:
   ```sql
   CREATE TABLE categories (
     id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(80) NOT NULL
   );
   CREATE TABLE posts (
     id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(200) NOT NULL,
     content MEDIUMTEXT NOT NULL,
     category_id INT UNSIGNED,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```
   и наполните её своими 5 записями через INSERT.
2. Создайте `.env` из `.env.example` с вашими доступами.
3. Реализуйте `includes/db.php`: установите PDO-подключение (host, dbname, user, pass из `.env`), `charset=utf8mb4`, режим ошибок — исключения.
4. В `includes/functions.php` замените `getPosts()`: вместо массива — `SELECT ... ORDER BY created_at DESC` через `$pdo`. Упрощайте связанные данные: пока можно вывести `category_id`.
5. Подключите `require __DIR__ . '/db.php';` на страницах и убедитесь, что главная показывает записи из БД.
6. Убедитесь, что `data/posts.json` больше не используется (можно удалить в этой лабе или лабе 10).

## Самопроверка
- Почему пароль БД нельзя захардкодить в `db.php`? Что будет, если такой код уйдёт в публичный репозиторий?
- Чем отличается вытащить данные через `query()`, `prepare()->execute()->fetchAll()` и в чём опасность первого способа при подстановке значений?
- Какие два-три типа полей вы использовали в `posts` и почему именно эти?
- Что вернёт `fetchAll(PDO::FETCH_ASSOC)` — объекты, массивы, строки?

## Критерий «зачтено»
- БД `diary_db` с таблицами `posts`/`categories`, наполнена 5 записями.
- `db.php` использует PDO и параметры из `.env` (не из кода).
- Главная выводит записи из MySQL; фильтр/поиск из лабы 8 продолжают работать поверх данных БД.

## Ожидаемый результат в git
```bash
git add .
git commit -m "[lab-09] Подключение MySQL через PDO, записи из БД"
git tag lab-09 && git push && git push --tags
```