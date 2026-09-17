# Лабораторная работа №4 — JavaScript: данные, переменные, функции и условия

**Тема:** хранение записей и работа с ними на клиенте.
**Цель:** вынести записи блога в структуру данных JavaScript, научиться описывать
обработку данных функциями с условиями, сократить дублирование кода.

## Что нужно реализовать (чек-лист)

- [ ] Подключён `js/main.js` в `index.html` (атрибут `defer`).
- [ ] Записи блога — массив объектов `posts` (поля: `id`, `title`, `content`, `category`, `date`, `author`);
      минимум **5 ваших** записей.
- [ ] Функция `renderPosts(list)` — строит разметку записей и выводит её на страницу
      (в гла].себto; — в `<section id="posts">`).
- [ ] Функция `sortPostsByDate(list)` — сортирует копию массива по дате (новые сверху).
- [ ] Функция `filterByCategory(list, category)` — возвращает записи выбранной категории.
- [ ] Используются `const`/`let` по смыслу, есть минимум одно условие (`if/else`).
- [ ] Страница не «падает», если список пуст (есть сообщение «Записей нет»).

## Самая нужная теория + документация

- **Переменные:** `const` нельзя переназначать, `let` можно. Правило курса: по умолчанию `const`,
  `let` — только когда значение обязано меняться. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types
- **Массивы и объекты:** запись блога удобно представить объектом; много записей — массивом.
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
- **Функции:** именованные `function f() {}`, стрелочные `const f = () => {}`.
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions
- **Условия:** `if / else if / else`, сравнение `===`, булева логика.
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling
- **Методы массивов:** `.filter()`, `.sort()`, `.map()` не меняют исходный массив, а возвращают новый.
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
- **Правило курса (важно!):** функции получают данные **аргументом**, а не читают глобальные
  переменные напрямую — так их можно переиспользовать и тестировать.

## Ход работы

1. Создайте в `js/main.js` массив `posts` из 5 своих записей с перечисленными полями.
2. Напишите `renderPosts(list)`:
   ```js
   function renderPosts(list) {
     const container = document.getElementById('posts');
     if (list.length === 0) {
       container.innerHTML = '<p>Записей нет.</p>';
       return;
     }
     // TODO лаба 4: соберите разметку записей циклом и присвойте container.innerHTML
   }
   ```
3. Напишите `sortPostsByDate(list)` — верните **копию** (`[...list]`), отсортированную по `date`
   (для дат сравнивайте как строки в формате `ГГГГ-ММ-ДД` — этот формат и сортируется лексикографически).
4. Напишите `filterByCategory(list, category)`; при пустой категории возвращайте `list`.
5. Вызовите `renderPosts(sortPostsByDate(posts))` по загрузке страницы и проверьте вывод.
6. Проверьте в консоли: `filterByCategory(posts, 'study')`, `sortPostsByDate(posts)` — массив
   остаётся неизменным.

## Самопроверка

- Чем `const` отличается от `let`? Когда что используете?
- Почему `sortPostsByDate` должна вернуть копию, а не мутировать `posts`?
- Что вернёт `filter` без совпадений — как это обработано в коде?
- Разница `==` и `===`? Почему курс требует `===`?
- В чём разница именованной и стрелочной функции?

## Критерий «зачтено»

- Вывод списка работает через функцию, а не «в лоб» циклом при каждой перезагрузке.
- `sortPostsByDate` и `filterByCategory` переиспользуются и не меняют исходный массив.
- Обработан пустой список.

## Как отправить (протокол курса)

```bash
cd diary-blog
git add .
git commit -m "[lab-04] Данные записей: массив, функции, сортировка и фильтр"
git tag lab-04 && git push && git push --tags
```
Отправьте: `Сдаю: lab-04` + ссылку `https://github.com/<ваш логин>/diary-blog/tree/lab-04`.