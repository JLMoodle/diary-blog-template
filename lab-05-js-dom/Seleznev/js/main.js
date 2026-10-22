/* ============================================================
   main.js — скелет лабы 5. DOM, форма, события, localStorage.
   Скелет конкретного index.html уже в папке lab-05-js-dom.
   ============================================================ */

/* ---------- 1. Данные (копия результата лабы 4) ---------- */
const posts = [
  {
    id: 1,
    title: 'Изучение GitHub',
    content: 'Описание того, как и с чего я начал изучение GitHub',
    category: 'study',
    date: '2026-09-01',
    author: 'Максим Селезнев'
  },
  {
    id: 2,
    title: 'Знакомство с HTML',
    content: 'Первые шаги в изучении HTML и его особенностей',
    category: 'study',
    date: '2026-10-08',
    author: 'Максим Селезнев'
  },
  {
    id: 3,
    title: 'Использование Visual Studio Code',
    content: 'Базовые навыки работы в Visual Studio Code, чем удобен при работе с кодом и почему именно он',
    category: 'tech',
    date: '2026-09-03',
    author: 'Максим Селезнев'
  },
  {
    id: 4,
    title: 'Первый репозиторий',
    content: 'Создание первого репозитория в GitHub, какие возникли трудости и какие навыки освоил',
    category: 'projects',
    date: '2026-10-02',
    author: 'Максим Селезнев'
  },
  {
    id: 5,
    title: 'CSS и JavaScript',
    content: 'Изучение принципов работы CSS и JavaScript, попытка применения их на практике',
    category: 'study',
    date: '2026-10-16',
    author: 'Максим Селезнев'
  }
];

const categories = ['study', 'projects', 'tech'];

/* ---------- 2. localStorage ---------- */
const STORAGE_KEY = 'diary-blog-user-posts';

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
renderPosts([...userPosts, ...posts]);

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
  posts.unshift(newPost);
  userPosts.unshift(newPost);

  saveUserPosts(userPosts);

  const savedIds = new Set(userPosts.map(post => post.id));
  const allPosts = [
    ...userPosts,
    ...posts.filter(post => !savedIds.has(post.id))
  ];

  renderPosts(allPosts);
  form.reset();
  clearErrors();

});