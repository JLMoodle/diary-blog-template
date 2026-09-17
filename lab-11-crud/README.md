# Лабораторная работа №11 — CRUD: создание, чтение, редактирование, удаление

**Тема:** полный цикл работы с записью.
**Цель:** реализовать 4 страницы над таблицей `posts` через PDO и методы HTTP:
`create` (INSERT), `read` (SELECT), `update` (UPDATE), `delete` (DELETE).

## Чек-лист

- [ ] `posts/index.php` — список всех записей из БД (читаете лабу 9; JOIN добавите в лабе 12).
- [ ] `posts/view.php?id=N` — одна запись: `SELECT * FROM posts WHERE id = ?` через prepare;
      если не найдено — `http_response_code(404)` + текст «Запись не найдена».
- [ ] `posts/add.php` — форма (POST на саму себя) + `INSERT INTO posts (…) VALUES (?, …)`
      + `e()` на всех полях + редирект `Location: posts/view.php?id=…` после успеха (PRG).
- [ ] `posts/edit.php?id=N` — форма предзаполнена текущими значениями; обработка POST →
      `UPDATE posts SET … WHERE id = ?`; после успеха — редирект на view.
- [ ] `posts/delete.php?id=N` — **не** обычная ссылка, а страница-подтверждение + отдельная
      **POST**-форма; обработчик: `DELETE FROM posts WHERE id = ?` и редирект на список.
- [ ] Ни одного значения не собрано в SQL конкатенацией — только `?` + `execute([...])`.
- [ ] Валидация на сервере (заголовок ≥ 3, текст ≥ 20 — как в лабе 8).
- [ ] На главной у каждой карточки есть ссылки «Читать» / «Изменить» / «Удалить».

## Объяснение (документация + краткая теория)

- **Что такое CRUD:** четыре операции над данными — Create / Read / Update / Delete — это
  основа любого приложения с данными. https://developer.mozilla.org/ru/docs/Glossary/CRUD
- **INSERT** — добавить строку. `lastInsertId()` возвращает id новой записи (нужен для
  редиректа на view). https://www.php.net/manual/ru/pdo.lastinsertid.php
- **SELECT ... WHERE id = ?** — чтение одной строки: `fetch()` (а не `fetchAll()`).
  https://www.php.net/manual/ru/pdostatement.fetch.php
- **UPDATE ... SET col = ? WHERE id = ?** — всегда указывайте `WHERE id = ?`, иначе обновите
  всю таблицу разом. https://www.php.net/manual/ru/pdo.prepare.php
- **DELETE FROM ... WHERE id = ?** — то же правило: без WHERE удалите всё.
  https://dev.mysql.com/doc/refman/8.0/en/delete.html
- **Почему удаление не простой ссылкой?** ссылка — это GET, а GET браузер сам может «дёрнуть»
  (префетч, поисковик, повторное нажатие стрелки назад). Изменение состояния должно идти
  через POST с явным подтверждением. См. https://developer.mozilla.org/ru/docs/Web/HTTP/Methods
- **PRG (Post/Redirect/Get):** после обработки POST — `header('Location: ...')` + `exit;`.
  Обновление страницы (F5) тогда не повторит INSERT/UPDATE/DELETE.
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections

## Пошагово

1. Скопируйте из лабы 9 `includes/functions.php` с `db()`/`getPosts()`.
2. Сделайте `posts/index.php` (список) — почти копия современной главной, но `require`
   из `includes/header.php` / `footer.php`.
3. `view.php`: получите `$id = (int)($_GET['id'] ?? 0);` → prepared SELECT → fetch;
   `if (!$post) { http_response_code(404); … exit; }` → выведите через `e()`.
4. `add.php`: если POST — валидируйте, соберите `$errors`, при успехе INSERT +
   `header('Location: view.php?id=' . $newId); exit;`; иначе (GET или ошибки) — показать форму.
5. `edit.php`: при GET заполните форму из `$_POST` если ошибка, иначе из БД; POST → UPDATE.
6. `delete.php`: GET — форма с `hidden id` и текстом «Точно удалить?»; POST — `DELETE`;
   после — редирект на `index.php`.
7. Прогоните полный цикл в браузере: создать → увидеть в списке → открыть → изменить →
   удалить.

## Самопроверка

- Что вернёт `fetch()` для несуществующего `id`? Почему это удобно для 404?
- Зачем `(int)` перед `$_GET['id']`? Что будет без него с `view.php?id[]=1`?
- Почему после INSERT/UPDATE/DELETE обязательно `exit;` после `header(...)`?
- Что плохого в `exec("DELETE FROM posts WHERE id = " . $_GET['id'])`? (Развёрнуто — лаба 14.)

## Критерий «зачтено»

- Работают все 4 операции из браузера; неверный `id` даёт «404» и не роняет страницу;
- всё — через prepared statements; удаление — через POST с подтверждением;
  после операций — редиректы (PRG).

## Как отправить

```bash
cd diary-blog
git add .
git commit -m "[lab-11] CRUD: add/view/edit/delete через PDO"
git tag lab-11 && git push && git push --tags
```
Сдаёте: `lab-11` + `https://github.com/<ваш логин>/diary-blog/tree/lab-11`.
