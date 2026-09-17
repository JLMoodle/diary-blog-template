# Лабораторная работа №6 — Fetch API. Получение данных с сервера

**Тема:** асинхронная загрузка данных (записей блога) через `fetch()`.
**Цель:** вынести записи в файл-«API» `data/posts.json`, загружать их по сети и обрабатывать
состояния «загружается / готово / ошибка».

## Что нужно реализовать (чек-лист)

- [ ] Записи перенесены из JS-массива в `data/posts.json` (это имитация серверного API).
- [ ] Загрузка через `fetch('data/posts.json')` + `res.json()`.
- [ ] Использован `async/await` (или надёжные `.then()` цепочки).
- [ ] Пока данные грузятся — показано «Загрузка записей…»; если файл недоступен — «Ошибка загрузки».
- [ ] После загрузки записи рендерятся функциями из лаб 4–5.
- [ ] Поиск/фильтр (лаба 4) и валидируемая форма (лаба 5) продолжают работать.

## Объяснение (теория + документация)

- **HTTP-запрос/ответ:** браузер отправляет запрос на `data/posts.json`, сервер отвечает
  телом и **статусом** (200 OK, 404, 500...). https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview
- **fetch()** — встроенное API браузера для сетевых запросов; возвращает **Promise**.
  https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
- **async/await** — «синтаксический сахар» над промисами, читается линейно:
  ```js
  async function loadPosts() {
    const res = await fetch('data/posts.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  }
  ```
  https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await
- **Обработка ошибок** — `try { ... } catch (err) { ... }`: ловим и сеть, и HTTP-статус.
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
- Важно: **файл через fetch недоступен по протоколу `file://`** — проект нужно открывать через
  локальный сервер. Один из способов из папки проекта:
  ```bash
  python3 -m http.server 8000
  # или
  php -S localhost:8000
  ```
  Затем открывайте http://localhost:8000 — про HTTP-серверы читайте в лабе 7.

## Пошаговая инструкция

1. В `data/posts.json` положите массив ваших записей из лаб 4–5 (поля: `id`, `title`,
   `content`, `category`, `date`, `author`).
2. В `js/main.js` реализуйте `async function loadPosts()`, как в теории выше.
3. Добавьте `function showLoading() / showError(msg)` — они рисуют «Загрузка…» / «Ошибка…»
   в контейнере записей **как DOM-элементы** (лаба 5).
4. Перепишите последовательность старта:
   ```js
   const posts = await loadPosts();   // иначе — финальный рендер в load
   renderPosts(posts);
   ```
   обязательно обернуто в `try/catch`; в `catch` — `showError`.
5. Уберите внутренний массив `posts` (данные теперь приходят извне): все функции
   (`renderPosts`, `sortPostsByDate`, `filterByCategory`) должны получать данные аргументом.
6. Проверьте в консоли браузера: вкладка **Network** → обновить страницу → виден запрос
   к `posts.json` со статусом 200. Отключите сеть (Offline в DevTools) → убедитесь, что
   появляется «Ошибка загрузки».

## Самопроверка

- Почему `fetch` не бросает исключение при ответе «404»? Что нужно проверить самому?
- В чём разница `res.json()` и `res.text()`? Когда что?
- Зачем нужен `throw` внутри `if (!res.ok)`?
- Почему данные нельзя «подождать» в обычной функции без `async`?

## Критерий «зачтено»

- Данные приходят через `fetch` из `posts.json`; страница показывает «Загрузка…», потом записи.
- Обработан случай ошибки сети (есть сообщение пользователю).
- Работают фильтр/поиск и форма добавления из лабы 5 на загруженных данных.

## Как отправить

```bash
cd diary-blog
git add .
git commit -m "[lab-06] Fetch API: асинхронная загрузка записей"
git tag lab-06 && git push && git push --tags
```
Ссылка для сдачи: `https://github.com/<ваш логин>/diary-blog/tree/lab-06`