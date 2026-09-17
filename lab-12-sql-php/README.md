# Лабораторная работа №12 — SQL+PHP: JOIN, агрегация, подзапросы, индексы и пагинация

**Цель:** научиться писать правильные многотабличные выборки: `JOIN`, `GROUP BY` +
агрегатные функции, `COUNT(*)`, вложенные запросы; добавить понятную **пагинацию** главной
и убедиться, что запросы ускоряются индексами из лабы 10.

## Чек-лист

- [ ] Главная выводит записи **вместе с именем автора и категорией одним SQL**:
  ```sql
  SELECT p.id, p.title, p.content, p.created_at,
         u.username AS author_name, c.name    AS category_name
  FROM posts p
  JOIN users u      ON u.id = p.user_id
  JOIN categories c ON c.id = p.category_id
  WHERE p.status = 'published'
  ORDER BY p.created_at DESC
  LIMIT 5 OFFSET ?;
  ```
- [ ] Справа от записей — «N записей в категории X»: один запрос с `GROUP BY`:
  ```sql
  SELECT c.name, COUNT(p.id) AS cnt
  FROM categories c
  LEFT JOIN posts p ON p.category_id = c.id AND p.status='published'
  GROUP BY c.id, c.name
  ORDER BY c.name;
  ```
- [ ] Пагинация: `?page=N`, `LIMIT ? OFFSET ?` (как в лабах 10/11), кнопки «‹ Назад / 1 2 3 … / Вперёд ›»;
      общее число страниц = `ceil(COUNT(*) / PER_PAGE)`.
- [ ] В sidebar — «последние комментарии» через подзапрос или JOIN (5 штук).
- [ ] Поиск из лабы 8 переведён на `MATCH(title, content) AGAINST (?)` (FULLTEXT из лабы 10).
- [ ] Категория/поиск/страница не теряются при переходе между страницами пагинации
      (аккуратная сборка строки запроса в ссылках).

## Мини-теория + документация

- **JOIN** — связывает строки двух таблиц по условию; `LEFT JOIN` оставляет все строки
  левой таблицы даже без пары. https://dev.mysql.com/doc/refman/8.0/en/join.html
- **Агрегация:** `COUNT(*)`, `SUM()`, `AVG()`, `MIN/MAX()` + обязательный `GROUP BY` по
  неагрегированным колонкам. https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions-and-modifiers.html
- **`HAVING`** — фильтр по результату агрегации (в отличие от `WHERE` до `GROUP BY`).
  https://dev.mysql.com/doc/refman/8.0/en/select.html
- **Подзапросы** — «SELECT внутри SELECT»; полезны для «максимум/минимум», счётчиков.
  https://dev.mysql.com/doc/refman/8.0/en/subqueries.html
- **Индексы и скорость:** если убрать индекс из лабы 10, `EXPLAIN` покажет `type=ALL`
  (полное сканирование) — на больших данных это минуты вместо миллисекунд.
  https://dev.mysql.com/doc/refman/8.0/en/explain-output.html

## Пошагово

1. Напишите функцию `getPostsWithMeta(int $page): array`, выполняющую первый SQL выше с
   `OFFSET = ($page - 1) * PER_PAGE`. Плюс `getTotalPostsCount(): int`.
2. `LEFT JOIN` + `GROUP BY` → `getCategoryCounts(): array` для сайдбара.
3. `getRecentComments(): array` — `SELECT c.body, c.created_at, p.title
   FROM comments c JOIN posts p ON p.id = c.post_id ORDER BY c.created_at DESC LIMIT 5`.
4. Соберите ссылки пагинации, сохраняя `q` и `category` из `$_GET`.
5. Сравните до/после: `EXPLAIN` главной выборки — покажите в README, что `type` изменился
   с `ALL` на `ref` (индекс по `category_id`/`status`).

## Самопроверка

- Что вернёт `SELECT * FROM posts p JOIN categories c ON c.id = p.category_id` для записи
  без категории? Что изменит `LEFT JOIN`?
- Почему в `GROUP BY c.name` счётчик не обязан сломаться, но правильнее группировать по `c.id`?
- Чем `WHERE count > 1` отличается от `HAVING count > 1` и когда что допустимо?
- Зачем `LIMIT ? OFFSET ?` через prepare-параметры, а не подстановкой?
- В чём разница FULLTEXT против `LIKE '%…%'` с точки зрения индекса?

## Критерий «зачтено»

Работают: главная с JOIN (одна выборка с автором/категорией), счётчики категорий,
пагинация с сохранением фильтров, поиск через FULLTEXT, «свежие комментарии». В README —
`EXPLAIN` до/после.

## Отправка

```bash
cd diary-blog
git add .
git commit -m "[lab-12] SQL+PHP: JOIN, GROUP BY, пагинация, FULLTEXT"
git tag lab-12 && git push && git push --tags
```
Сдаёте: `lab-12` + `https://github.com/<ваш логин>/diary-blog/tree/lab-12`.
