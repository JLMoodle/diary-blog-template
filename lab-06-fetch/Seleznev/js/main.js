/* ============================================================
   main.js — скелет лабы 5. DOM, форма, события, localStorage.
   Скелет конкретного index.html уже в папке lab-05-js-dom.
   ============================================================ */

/* ---------- 1. Данные (копия результата лабы 4) ---------- */
let posts = [];

const categories = ['study', 'projects', 'tech'];

/* ---------- 2. localStorage ---------- */
const STORAGE_KEY = 'diary-blog-user-posts';
async function loadPosts() {
  const response = await fetch('data/posts.json');
  if (!response.ok) {
    throw new Error('HTTP ' + response.status);
  }
  const data = await response.json();
  return data;
}
function showLoading() {
    const container = document.getElementById('posts');

    container.textContent = '';

    const message = document.createElement('p');
    message.textContent = 'Загрузка записей...';

    container.append(message);
}
function showError(msg) {
    const container = document.getElementById('posts');

    container.textContent = '';

    const error = document.createElement('p');
    error.className = 'error';
    error.textContent = msg;

    container.append(error);
}

function loadUserPosts() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        return [];
    }

    try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveUserPosts(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
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
function sortPostsByDate(list) {
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
}

function filterByCategory(list, category) {
    if (category === '') return list;

    return list.filter(post => post.category === category);
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
    Object.entries(errors).forEach(([fieldName, message]) => {
        const field = document.getElementById(fieldName);

        if (!field) return;

        const error = document.createElement('p');
        error.className = 'error';
        error.textContent = message;

        field.after(error);
    });
}

function clearErrors() {
  document.querySelectorAll('#add-post .error')
    .forEach(error => error.remove());
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

let userPosts = loadUserPosts();

async function init() {
    showLoading();

    try {
        posts = await loadPosts();

        renderPosts([...userPosts, ...posts]);

    } catch (error) {
        console.error('Ошибка загрузки записей:', error);
        showError('Ошибка загрузки записей.');
    }
}

init();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors();

  const data = {
    title: document.getElementById('title').value,
    category: categorySelect.value,
    content: document.getElementById('content').value
  };

  const errors = validatePost(data);

  if (Object.keys(errors).length > 0) {
    showErrors(errors);
    return;
  }
  const now = new Date();

  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('-');

  const newPost = {
    id: Date.now(),
    title: data.title.trim(),
    category: data.category,
    content: data.content.trim(),
    date: today,
    author: 'Максим Селезнев'
  };
userPosts.unshift(newPost);

saveUserPosts(userPosts);

renderPosts([...userPosts, ...posts]);
  form.reset();
  clearErrors();

});