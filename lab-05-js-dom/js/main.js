/* ============================================================
   main.js — скелет лабы 5. DOM, форма, события, localStorage.
   Скелет конкретного index.html уже в папке lab-05-js-dom.
   ============================================================ */

/* ---------- 1. Данные (копия результата лабы 4) ---------- */
const posts = [
  // TODO: перенесите свои 5 записей из лабы 4
];

const categories = ['study', 'hobby', 'tech', 'life'];

/* ---------- 2. localStorage ---------- */
const STORAGE_KEY = 'diary-blog-user-posts';

function loadUserPosts() {
  // TODO: прочитать JSON-строку из localStorage, распарсить, вернуть массив
  // (пустой массив, если ключа нет). https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
  return [];
}

function saveUserPosts(list) {
  // TODO: JSON.stringify + localStorage.setItem(STORAGE_KEY, ...)
}

/* ---------- 3. DOM-построение карточки (БЕЗ innerHTML) ---------- */
function createPostElement(post) {
  const card = document.createElement('article');
  card.className = 'post';

  const h3 = document.createElement('h3');
  h3.textContent = post.title;
  card.append(h3);

  const timeEl = document.createElement('time');
  timeEl.dateTime = post.date;
  timeEl.textContent = post.date;
  card.append(timeEl);

  const p = document.createElement('p');
  p.textContent = post.content;
  card.append(p);

  return card;
}

/* ---------- 4. Рендер ---------- */
function renderPosts(list) {
  const container = document.getElementById('posts');
  container.innerHTML = '';            // очистка старых карточек
  if (list.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Записей нет. Добавьте первую';
    container.append(empty);
    return;
  }
  list.forEach(post => container.append(createPostElement(post)));
}

/* ---------- 5. Валидация формы ---------- */
function validatePost(data) {
  const errors = {};
  if (data.title.trim().length < 3) errors.title = 'Заголовок — минимум 3 символа';
  if (!data.category) errors.category = 'Выберите категорию';
  if (data.content.trim().length < 20) errors.content = 'Текст — минимум 20 символов';
  return errors;
}

function showErrors(errors) {
  // TODO: для каждой ошибки вывести <p class="error"> под нужным полем
}

function clearErrors() {
  // TODO: убрать все <p class="error"> со страницы
}

/* ---------- 6. Инициализация ---------- */
const form = document.getElementById('add-post');
const categorySelect = document.getElementById('category');

categories.forEach(cat => {
  const opt = document.createElement('option');
  opt.value = cat;
  opt.textContent = cat;
  categorySelect.append(opt);
});

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// TODO: отрендерить posts + добавленные пользователем из localStorage

form.addEventListener('submit', (event) => {
  event.preventDefault();
  // TODO: собрать данные полей, прогнать validatePost,
  // при ошибках — showErrors и return; иначе —
  // создать запись, добавить в posts, сохранить в localStorage, renderPosts, очистить форму.
});