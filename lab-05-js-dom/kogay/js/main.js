/* ============================================================
   main.js — скелет лабы 5. DOM, форма, события, localStorage.
   Скелет конкретного index.html уже в папке lab-05-js-dom.
   ============================================================ */

/* ---------- 1. Данные (копия результата лабы 4) ---------- */
const posts = [
  {
    id: 1,
    title: 'Моя учёба в университете',
    content: 'Я учусь в университете и изучаю информационные технологии. На занятиях узнаю много нового и полезного.',
    category: 'study',
    date: '2026-11-25',
    author: 'Когай Валерия'
  },
  {
    id: 2,
    title: 'Занятия в университете',
    content: 'На занятиях мы изучаем программирование, базы данных и информационную безопасность.',
    category: 'study',
    date: '2026-11-23',
    author: 'Когай Валерия'
  },
  {
    id: 3,
    title: 'Моё любимое увлечение',
    content: 'В свободное время я люблю смотреть сериалы, отдыхать и заниматься своими делами.',
    category: 'hobby',
    date: '2026-11-20',
    author: 'Когай Валерия'
  },
  {
    id: 4,
    title: 'Моё рабочее место',
    content: 'Мне нравится, когда на рабочем столе порядок. Удобное рабочее место помогает лучше сосредоточиться.',
    category: 'life',
    date: '2026-11-18',
    author: 'Когай Валерия'
  },
  {
    id: 5,
    title: 'Почему важно изучать технологии',
    content: 'Современные технологии используются во многих сферах жизни. Поэтому важно постоянно узнавать что-то новое.',
    category: 'tech',
    date: '2026-11-15',
    author: 'Когай Валерия'
  }
];

const categories = ['study', 'hobby', 'tech', 'life'];

/* ---------- 2. localStorage ---------- */
const STORAGE_KEY = 'diary-blog-user-posts';

function loadUserPosts() {
  const savedPosts = localStorage.getItem(STORAGE_KEY);

  if (savedPosts === null) {
    return [];
  }

  return JSON.parse(savedPosts);
}

function saveUserPosts(list) {
  const postsJSON = JSON.stringify(list);
  localStorage.setItem(STORAGE_KEY, postsJSON);
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
  container.replaceChildren();            // очистка старых карточек
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
  for (const field in errors) {
    const error = document.getElementById(`${field}-error`);
    error.textContent = errors[field];
  }
}

function clearErrors() {
  const errors = document.querySelectorAll('.error');

  errors.forEach(error => {
    error.textContent = '';
  });
}

/* ---------- 6. Инициализация ---------- */
const form = document.getElementById('add-post');
const categorySelect = document.getElementById('category');

const categoryNames = {
  study: 'Учёба',
  hobby: 'Хобби',
  tech: 'Технологии',
  life: 'Жизнь'
};

const defaultOption = document.createElement('option');
defaultOption.value = '';
defaultOption.textContent = 'Выберите категорию';
defaultOption.selected = true;
defaultOption.disabled = true;
categorySelect.append(defaultOption);
categories.forEach(cat => {
  const opt = document.createElement('option');
  opt.value = cat;
  opt.textContent = categoryNames[cat];
  categorySelect.append(opt);
});

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const userPosts = loadUserPosts();
const allPosts = [...userPosts, ...posts];

renderPosts(allPosts);

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

const newPost = {
  id: Date.now(),
  title: data.title.trim(),
  content: data.content.trim(),
  category: data.category,
  date: new Date().toISOString().slice(0, 10),
  author: 'Когай Валерия'
};

userPosts.unshift(newPost);
allPosts.unshift(newPost);

saveUserPosts(userPosts);

renderPosts(allPosts);

form.reset();
});
