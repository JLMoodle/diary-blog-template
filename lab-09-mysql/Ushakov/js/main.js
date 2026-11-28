const categories = ['study', 'hobby', 'tech', 'life'];
const STORAGE_KEY = 'diary-blog-user-posts';

// Лаба 6: убрали жёстко заданный массив posts — данные теперь загружаются из data/posts.json
let serverPosts = [];
let userPosts = [];
let activeCategory = null;

// Лаба 6 (Шаг 2): асинхронная загрузка записей с сервера через fetch() + async/await и проверка HTTP-статуса
async function loadPosts() {
  const res = await fetch('data/posts.json');
  if (!res.ok) {
    throw new Error('HTTP ' + res.status);
  }
  return await res.json();
}

// Лаба 6 (Шаг 3): отображение состояния загрузки «Загрузка записей…» как DOM-элемента в контейнере #posts
function showLoading() {
  const container = document.getElementById('posts');
  if (!container) return;
  container.innerHTML = '';
  const p = document.createElement('p');
  p.className = 'loading';
  p.textContent = 'Загрузка записей…';
  container.append(p);
}

// Лаба 6 (Шаг 3): отображение состояния ошибки как DOM-элемента в контейнере #posts
function showError(msg) {
  const container = document.getElementById('posts');
  if (!container) return;
  container.innerHTML = '';

  const p = document.createElement('p');
  p.className = 'error';
  p.textContent = msg || 'Ошибка загрузки';
  container.append(p);
}

function loadUserPosts() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveUserPosts(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Лаба 6 (Шаг 5): функции фильтрации и сортировки принимают массив записей аргументом
function filterByCategory(list, category) {
  if (!category) return list;
  return list.filter(post => post.category === category);
}

function sortPostsByDate(list) {
  return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function createPostElement(post) {
  const card = document.createElement('article');
  card.className = 'post';

  const h3 = document.createElement('h3');
  h3.textContent = post.title;
  card.append(h3);

  const infoP = document.createElement('p');
  const timeEl = document.createElement('time');
  timeEl.dateTime = post.date;
  timeEl.textContent = post.date;
  infoP.append(timeEl);

  if (post.category) {
    const catSpan = document.createElement('span');
    catSpan.textContent = ` | Категория: ${post.category}`;
    infoP.append(catSpan);
  }

  // Лаба 6 (Шаг 1): вывод поля author из записей posts.json
  if (post.author) {
    const authorSpan = document.createElement('span');
    authorSpan.textContent = ` | Автор: ${post.author}`;
    infoP.append(authorSpan);
  }

  card.append(infoP);

  const p = document.createElement('p');
  p.textContent = post.content;
  card.append(p);

  return card;
}

function renderPosts(list) {
  const container = document.getElementById('posts');
  if (!container) return;
  container.innerHTML = '';

  if (list.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Записей нет. Добавьте первую';
    container.append(empty);
    return;
  }

  list.forEach(post => container.append(createPostElement(post)));
}

// Лаба 6 (Шаг 5): объединение пользовательских постов с загруженными из posts.json, сортировка и фильтрация перед рендером
function updateView() {
  const combined = sortPostsByDate([...userPosts, ...serverPosts]);
  const filtered = filterByCategory(combined, activeCategory);
  renderPosts(filtered);
}

function validatePost(data) {
  const errors = {};
  if (data.title.trim().length < 3) errors.title = 'Заголовок — минимум 3 символа';
  if (!data.category) errors.category = 'Выберите категорию';
  if (data.content.trim().length < 20) errors.content = 'Текст — минимум 20 символов';
  return errors;
}

function showErrors(errors) {
  clearErrors();
  for (const field in errors) {
    const inputElement = document.getElementById(field);
    if (inputElement) {
      const errorP = document.createElement('p');
      errorP.className = 'error';
      errorP.textContent = errors[field];
      inputElement.after(errorP);
    }
  }
}

function clearErrors() {
  const errorElements = document.querySelectorAll('.error');
  errorElements.forEach(el => el.remove());
}

const form = document.getElementById('add-post');
const categorySelect = document.getElementById('category');
const categoryLinks = document.querySelectorAll('aside ul a');

if (categorySelect) {
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.append(opt);
  });
}

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Лаба 6 (Чек-лист): фильтрация по категориям из сайдбара на данных, загруженных из posts.json
categoryLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const clickedCategory = link.textContent.trim();

    if (activeCategory === clickedCategory) {
      activeCategory = null;
      link.classList.remove('active');
    } else {
      activeCategory = clickedCategory;
      categoryLinks.forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }

    updateView();
  });
});

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();

    const formData = {
      title: document.getElementById('title').value,
      category: document.getElementById('category').value,
      content: document.getElementById('content').value
    };

    const errors = validatePost(formData);
    if (Object.keys(errors).length > 0) {
      showErrors(errors);
      return;
    }

    const newPost = {
      id: Date.now(),
      title: formData.title.trim(),
      category: formData.category,
      content: formData.content.trim(),
      date: new Date().toISOString().split('T')[0],
      author: 'Никита'
    };

    userPosts.unshift(newPost);
    saveUserPosts(userPosts);
    updateView();
    form.reset();
  });
}
// Лаба 6 (Шаг 4): последовательность старта — показ индикатора загрузки, await loadPosts() в try/catch и вывод ошибки в catch
async function init() {
  userPosts = loadUserPosts();
  showLoading();

  try {
    serverPosts = await loadPosts();
    updateView();
  } catch (err) {
    console.error(err);
    showError('Ошибка загрузки');
  }
}

init();