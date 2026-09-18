# Лабораторная работа №13 — Оптимизация JavaScript: делегирование, debounce, Virtual DOM (вручную)

## Как работать в этой лабе (общий репозиторий группы)

В этой папке `lab-13-js-opt/` вы создаёте свою подпапку по фамилии и ведёте код только в ней.

1. Перед началом работы забрать чужие правки: `git pull --rebase`.
2. Создать свою подпапку: `mkdir lab-13-js-opt/<Фамилия>` (латиницей, например `kimsan`).
3. Скопировать скелет лабы **целой папкой** в свою подпапку, чтобы не сломались
   относительные пути (`css/`, `js/`, `data/`, `includes/`).
4. Правите только своё; чужие подпапки и скелеты не трогайте.
5. Сдача лабы — см. раздел «Как отправить» в конце этого файла.


**Тема:** сделать интерфейс быстрее и проще не «кнопками-кнопками», а инженерно:
меньше обработчиков, меньше перерисовок, меньше запросов.

## Чек-лист

- [ ] **Делегирование событий:** один `addEventListener` на `#posts` вместо обработчика на
      каждой карточке/кнопке; используется `e.target.closest('[data-action]')`.
- [ ] **Debounce** для поля поиска/живого фильтра (300 мс) — не дёргаем сервер на каждую букву.
- [ ] **Троттлинг** для scroll/resize (requestAnimationFrame) — не спамим расчёты.
- [ ] Рендер через `DocumentFragment` и минимум касаний DOM (без `container.innerHTML +=`).
- [ ] `script` — с `defer`, картинки — `loading="lazy"`.
- [ ] В `README.md` модуля описано: что было «до», что стало «после» (счётчики = число
      обработчиков, число DOM-узлов, число запросов при наборе «phpmy»).

## Теория + документация

- **Делегирование:** события всплывают от цели к документу; один слушатель на родителе
  ловит клики по всем детям, включая **добавленные позже**. 
  https://learn.javascript.ru/event-delegation
- `Event.target` — где реально кликнули; `closest('[data-action]')` — ближайший предок с
  этим атрибутом. https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
- **Debounce** — функция выполнится, только когда ввод «успокоился»:
  https://learn.javascript.ru/task/debounce и https://www.npmjs.com/package/**нет** (делаем руками)
- **Throttle через `requestAnimationFrame`**: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
- **DocumentFragment** — «черновик» в памяти; вставить за один раз:
  https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
- **`defer` / `async`**: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
- **`loading="lazy"`**: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/loading
- Почему это важно — Web Vitals, LCP: https://web.dev/articles/lcp

## Как делать

1. Замените `document.querySelectorAll('.delete-btn').forEach(...)` одним обработчиком на
   контейнере (см. скелет `js/main.js` в этой папке).
2. Поле поиска: `searchInput.addEventListener('input', debounce(handler, 300))`.
3. Все карточки рендерьте через `fragment.append(createPostElement(post))` и один
   `container.replaceChildren(fragment)`.
4. Добавьте `defer` в `<script>` и `loading="lazy"` к картинкам.
5. В Chrome DevTools → Performance снимите «до/после» и запишите в README.

## Самопроверка

- Почему обработчик на старой карточке «не увидит» клик по карточке, добавленной после?
- `innerHTML +=` перерисовывает: что теряется, если на карточке был `<input>` с фокусом?
- Чем debounce отличается от throttle — приведите пример для каждого.
- Что будет, если убрать `defer` и положить скрипт перед `</body>`? (Равноценные, если DOM
  не используется до конца разбора; докажите.)

## Критерий «зачтено»

- Один обработчик на контейнер (делегирование), debounce на поиске, рендер фрагментом;
  в README есть замеры «до/после».

## Как отправить (протокол курса)

Сдача лабы = ваша подпапка `<Фамилия>/` в master **общего** репозитория.

```bash
git add lab-13-js-opt/<Фамилия>/
git commit -m "[lab-13] <Фамилия>: <что сделано>"
git pull --rebase
git push
```

Отправьте преподавателю одну строку: `Сдаю: lab-13` + ссылку на вашу папку
`https://github.com/JLMoodle/diary-blog-template/tree/master/lab-13-js-opt/<Фамилия>`.

> Теги `lab-NN` и `v1.0` в шаблоне — вехи курса, их ставит преподаватель.
> Студенты личные теги на сдачу не ставят.
