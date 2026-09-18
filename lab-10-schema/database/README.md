# Лабораторная работа №10 — MySQL: схема БД, связи, ключи, ограничения

**Тема:** проектирование нормализованной схемы.
**Цель:** спроектировать и реализовать полную схему блога: таблицы `users`, `categories`,
`posts`, `comments` с первичными/внешними ключами, `UNIQUE`-ограничениями, индексами и
правилами удаления.

## Чек-лист (что реализовать)

- [ ] `database/schema.sql` содержит **все 4 таблицы** (users, categories, posts, comments).
- [ ] У каждой таблицы — `PRIMARY KEY`; внешние ключи с осмысленными `ON DELETE/ON UPDATE`.
- [ ] `NOT NULL`, `DEFAULT`, `UNIQUE` расставлены по смыслу (email, slug, username — UNIQUE).
- [ ] Индексы: по `created_at` (сортировка «свежие сверху»), по `category_id`/`user_id` (JOIN),
      FULLTEXT по `title, content` (поиск — лаба 12).
- [ ] Ограничения комментариев: `CHECK`/`ENUM` для `status` записей.
- [ ] В каждой таблице — 1–2 ваших комментария «почему так» (напр. почему `RESTRICT`,
      а не `CASCADE` для категорий).
- [ ] Схема импортируется повторно без ошибок (лаба 9: таблица `posts` уже есть — в схеме 10
      используйте `CREATE TABLE IF NOT EXISTS` или аккуратное `DROP`).

## Мини-теория + документация

- Какие бывают ключи: `PRIMARY KEY` (одна запись = одно значение), `UNIQUE KEY` (нет дублей),
  `FOREIGN KEY` (ссылка на другую таблицу). https://dev.mysql.com/doc/refman/8.0/en/glossary.html#glos_primary_key
- `ON DELETE` варианты: `CASCADE` — удалить вместе с родителем; `SET NULL` — обнулить ссылку
  (тогда колонка должна быть `NULL`-able); `RESTRICT` — запретить удаление родителя пока есть
  дети. https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html
- `ENUM` — перечисление допустимых значений (в `posts.status`: draft/published).
- `AUTO_INCREMENT` — автоматический счётчик, уникальность гарантирует движок.
- Индексы ускоряют WHERE/ORDER BY/JOIN; за расплату — чуть медленнее INSERT и больше места.
  https://dev.mysql.com/doc/refman/8.0/en/mysql-indexes.html
- FULLTEXT — полнотекстовый поиск (в лабе 12 подключим MATCH…AGAINST).
  https://dev.mysql.com/doc/refman/8.0/en/fulltext-search.html

## Пошаговая инструкция

1. Откройте `database/schema.sql`. Там уже есть таблица `posts` (из лабы 9) — не удаляйте её,
   а добавляйте остальные; для повторного импорта используйте `CREATE TABLE IF NOT EXISTS`.
2. Добавьте `users`: `id` PK AUTO_INCREMENT, `username` (UNIQUE, NOT NULL), `email` (UNIQUE,
   NOT NULL), `password_hash` NOT NULL, `role`. `AUTO_INCREMENT` стартует с 1 автоматически.
3. Добавьте `categories`: `id` PK, `name`, `slug` (UNIQUE — по нему делаем красивые URL).
4. Подключите связи:
   ```sql
   ALTER TABLE posts
     ADD COLUMN user_id INT UNSIGNED NULL,
     ADD COLUMN category_id INT UNSIGNED NULL,
     ADD CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users(id)
       ON DELETE SET NULL ON UPDATE CASCADE,
     ADD CONSTRAINT fk_posts_category FOREIGN KEY (category_id) REFERENCES categories(id)
       ON DELETE SET NULL ON UPDATE CASCADE;
   ```
   Объясните в комментарии: почему для авторов/категорий `SET NULL`, а для комментариев ниже `CASCADE`.
5. Создайте `comments`: `id` PK, `post_id` (FK→posts **ON DELETE CASCADE** — комментарий не
   может жить без записи), `user_id` (FK→users), `content`, `created_at`.
6. Индексы и ограничения:
   ```sql
   ALTER TABLE posts
     ADD INDEX idx_posts_created (created_at),
     ADD FULLTEXT INDEX ft_posts_search (title, content);
   ALTER TABLE comments ADD INDEX idx_comments_post (post_id);
   ```
7. Прогоните `mysql -u root -p < database/schema.sql` — без ошибок.
8. Проверьте в phpMyAdmin структуру: связи с «каскадами» видны на вкладке «Отношения».

## Самопроверка

- Что будет со `status='draft'` записью, если удалить категорию? (_По вашей схеме_ — ответ
  зависит от `ON DELETE`; объясните.)
- Почему `email` обязательно `UNIQUE`, а `username` — тоже? Что сломается без них?
- Зачем `slug` в `categories` и в `posts`? Чем он лучше `id` в URL?
- Что произойдёт, если забыть индекс для `comments.post_id` при удалении старых записей?

## Критерий «зачтено»

- Все 4 таблицы в одной схеме, связи FK с обоснованными `ON DELETE` (комментарии — CASCADE;
  категории/авторы — SET NULL или RESTRICT с аргументацией);
- `UNIQUE` на `email`/`username`/`slug`; `ENUM` для `status`; индексы на FK и `created_at`;
- импорт проходит повторно (`IF NOT EXISTS`), phpMyAdmin показывает связи.


## Как отправить

```bash
git add lab-10-schema/database/<Фамилия>/
git commit -m "[lab-10] <Фамилия>: схема БД — FK, индексы, пользователи, записи, комментарии"
git pull --rebase && git push
```
Сдаёте: `lab-10` + `https://github.com/JLMoodle/diary-blog-template/tree/master/lab-10-schema/database/<Фамилия>`.
Схема сохранялась по обучающему протоколу курса (см. lab-01): вся работа — в своей подпапке.
