# Лабораторная работа №5 — JavaScript: DOM, формы, события

## Как работать в этой лабе (общий репозиторий группы)

В этой папке `lab-05-js-dom/` вы создаёте свою подпапку по фамилии и ведёте код только в ней.

1. Перед началом работы забрать чужие правки: `git pull --rebase`.
2. Создать свою подпапку: `mkdir lab-05-js-dom/<Фамилия>` (латиницей, например `kimsan`).
3. Скопировать скелет лабы **целой папкой** в свою подпапку, чтобы не сломались
   относительные пути (`css/`, `js/`, `data/`, `includes/`).
4. Правите только своё; чужие подпапки и скелеты не трогайте.
5. Сдача лабы — см. раздел «Как отправить» в конце этого файла.


**Тема:** динамическое формирование интерфейса и работа с пользовательским вводом.
**Цель:** выводить записи через DOM-объекты (не строки), добавить форму «Новая запись» с
валидацией и сохранять добавленные записи в `localStorage`.

## Что нужно реализовать (чек-лист)

- [ ] `js/main.js` создаёт карточки записей средствами DOM: `createElement`,
  `textContent`, `append` (без `innerHTML` для данных).
- [ ] Форма «Новая запись» с полями: заголовок, категория (select), текст.
- [ ] Валидация: заголовок ≥ 3 символов; текст ≥ 20 символов; категория обязательна.
- [ ] Ошибки показаны пользователю (строки возле полей + класс `error`), форма не отправляется.
- [ ] Успешная запись добавляется в начало списка и сохраняется в `localStorage`.
- [ ] При загрузке записи из `localStorage` объединяются с базовым массивом `posts`.
- [ ] События — `addEventListener` (не inline-атрибуты `onclick`).

## Объяснение (теория + документация)

- **DOM** (Document Object Model) — объектная модель документа: каждый тег — узел-объект,
  который можно читать и менять. Основы: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction
- **Создание узлов:** `document.createElement('article')`, затем `textContent`,
  `className`, `append(to)` / `appendChild`. Справочник: https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
- **Почему `textContent`, а не `innerHTML`:** `textContent` трактует данные буквально
  («То, что вы напечатали, и есть текст»), а `innerHTML` «разберёт» ввод как HTML — это и есть
  приглашение к XSS (подробно — лаба 14). https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
- **События:** `element.addEventListener('click' | 'submit' | 'input', handler)`.
  Обзор: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events
- **Перехват submit:** `form.addEventListener('submit', e => { e.preventDefault(); ... })` —
  не даёт браузеру перезагрузить страницу. https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
- **Разбор даты:** `new Date('2026-09-01')` для работы с датой в коде.
- **localStorage:** хранит **строки**, объекты сериализуют через `JSON.stringify`/
  `JSON.parse`. Обзор: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
  Ключ курса: `diary-blog-user-posts`.

## Пошаговая инструкция

1. Откройте `js/main.js` — в нём заготовки функций и места `TODO`.
2. Реализуйте `createPostElement(post)` (см. подсказку лаба-04: там вы уже делали карточку
   строкой; перепишите её на DOM-объекты):
   ```js
   function createPostElement(post) {
     const card = document.createElement('article');
     card.className = 'post';

const h3 = document.createElement('h3');
      h3.textContent = post.title;
      card.append(h3);

     const timeEl = document.createElement('time');
     timeEl.dateTime = post.date;      // атрибут datetime
     timeEl.textContent = post.date;
     card.append(timeEl);

     const p = document.createElement('p');
     p.textContent = post.content;
     card.append(p);

     return card;
   }
   ```
3. Перепишите `renderPosts`: вместо строки и `innerHTML` — цикл, создающий `createPostElement`
   и добавляющий карточку в контейнер.
4. Добавьте под списком записей форму. Обязательные поля: `title` (text), `category` (select —
   варианты из `categories`), `content` (textarea).
5. Подпишитесь на `submit`: `preventDefault`, прочитать значения,
   собрать `errors = { title: '...', content: '...' }` при невыполнении условий валидации.
6. Если `errors` не пуст — выведите сообщения под нужными полями (например, через
   `p` с классом `error` рядом с полем) и завершите обработку.
7. Иначе — создайте объект записи (`id: Date.now()`, дата сегодня) и:
   - добавьте в начало **основного** массива `posts`;
   - сохраните в `localStorage` в отдельный ключ (объедините с уже сохранёнными);
   - очистите форму, вызовите `renderPosts`, сбросьте ошибки.
8. При старте: прочитайте ваши сохранённые записи из `localStorage` и объедините с `posts`
   (базовые + пользовательские → основа для списка).
9. Убедитесь, что `index.html` в `lab-05` (рабочая копия) подключает `js/main.js` с атрибутом
   `defer` и содержит контейнер `<div id="posts"></div>` и пустую форму.

## Самопроверка

- Почему для пользовательских данных `textContent` безопаснее `innerHTML`?
  Приведите пример того, что произойдёт с `innerHTML`, если ввести `<b>жирный</b>`.
- Зачем `e.preventDefault()` при `submit`?
- Зачем `JSON.stringify` перед сохранением в `localStorage`? Что будет, если сохранить объект напрямую?
- Какая запись считается «самой свежей» по вашему коду — добавленная или с большей `date`?

## Критерий «зачтено»

- DOM-построение карточек без `innerHTML` для текста.
- Форма валидируется; ошибки видны; запись без валидных данных не попадает в список.
- Добавленные записи переживают перезагрузку страницы (localStorage).

## Как отправить (протокол курса)

Сдача лабы = ваша подпапка `<Фамилия>/` в students **общего** репозитория.

```bash
git add lab-05-js-dom/<Фамилия>/
git commit -m "[lab-05] <Фамилия>: <что сделано>"
git pull --rebase
git push
```

Отправьте преподавателю одну строку: `Сдаю: lab-05` + ссылку на вашу папку
`https://github.com/JLMoodle/diary-blog-template/tree/students/lab-05-js-dom/<Фамилия>`.

> Ветка `main` — шаблон преподавателя, тег `v1.2` — актуальная версия; студенты их не изменяют.
> Студенты личные теги на сдачу не ставят.
