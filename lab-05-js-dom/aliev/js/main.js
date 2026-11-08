/* ============================================================
   Лабораторная работа №5. DOM, формы, события, localStorage.
   Студент: Алиев Махмуд, группа 8-24ИСиТ.
   ============================================================ */

/* ---------- 1. Базовые данные (результат лабы 4) ---------- */
const posts = [
  {
    id: 1,
    title: 'Как я начал вести дневник',
    content: 'Решение записывать события появилось после первой сессии: стало понятно, что важные мысли и выводы быстро забываются. Теперь несколько минут в день помогают видеть прогресс.',
    category: 'life',
    date: '2026-09-02',
    author: 'Алиев Махмуд'
  },
  {
    id: 2,
    title: 'Конспект по JavaScript',
    content: 'Разобрал различия между const и let, потренировался с массивами объектов и методами filter, sort, map. Главный вывод: функции должны получать данные аргументом.',
    category: 'study',
    date: '2026-09-12',
    author: 'Алиев Махмуд'
  },
  {
    id: 3,
    title: 'Сборка компьютера для учёбы',
    content: 'Собрал системный блок для учебных проектов: процессор, 16 ГБ оперативной памяти и быстрый SSD. Отдельно проверил охлаждение и аккуратно уложил кабели внутри корпуса.',
    category: 'tech',
    date: '2026-09-21',
    author: 'Алиев Махмуд'
  },
  {
    id: 4,
    title: 'Футбол в выходные',
    content: 'С друзьями провели товарищеский матч на школьном поле. Игра получилась напряжённой, но главное — хорошее настроение и возможность отвлечься от учёбы.',
    category: 'hobby',
    date: '2026-10-04',
    author: 'Алиев Махмуд'
  },
  {
    id: 5,
    title: 'Подготовка к контрольной работе',
    content: 'Составил план повторения темы «Информационные технологии»: основные понятия, классификация ИТ, аппаратное и программное обеспечение. Разбил материал на небольшие блоки.',
    category: 'study',
    date: '2026-10-18',
    author: 'Алиев Махмуд'
  }
];

/* ---------- 2. Справочники ---------- */
const categories = [
  { value: 'study', label: 'Учёба' },
  { value: 'hobby', label: 'Хобби' },
  { value: 'tech', label: 'Технологии' },
  { value: 'life', label: 'Жизнь' }
];

const categoryNames = Object.fromEntries(categories.map((item) => [item.value, item.label]));
const STORAGE_KEY = 'diary-blog-user-posts';

function formatDate(isoDate) {
  const parts = isoDate.split('-');
  return parts.length === 3 ? `${parts[2]}.${parts[1]}.${parts[0]}` : isoDate;
}

/* ---------- 3. localStorage ---------- */
function loadUserPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Не удалось прочитать localStorage:', error);
    return [];
  }
}

function saveUserPosts(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    console.warn('Не удалось сохранить записи:', error);
  }
}

/* ---------- 4. DOM-построение карточки (без innerHTML для данных) ---------- */
function createPostElement(post) {
  const card = document.createElement('article');
  card.className = 'post';

  const h3 = document.createElement('h3');
  h3.textContent = post.title;
  card.append(h3);

  const meta = document.createElement('p');
  meta.className = 'post-meta';

  const timeEl = document.createElement('time');
  timeEl.dateTime = post.date;
  timeEl.textContent = formatDate(post.date);

  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.textContent = categoryNames[post.category] || post.category;

  const author = document.createElement('span');
  author.textContent = post.author || 'Алиев Махмуд';

  meta.append(timeEl, tag, author);
  card.append(meta);

  const p = document.createElement('p');
  p.textContent = post.content;
  card.append(p);

  return card;
}

/* ---------- 5. Рендер списка ---------- */
function renderPosts(list) {
  const container = document.getElementById('posts');
  container.replaceChildren();

  if (!Array.isArray(list) || list.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'Записей нет. Добавьте первую.';
    container.append(empty);
    return;
  }

  list.forEach((post) => container.append(createPostElement(post)));
}

/* ---------- 6. Сортировка и фильтрация ---------- */
function sortPostsByDate(list) {
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
}

function filterByCategory(list, category) {
  if (!category || category === 'all') return list;
  return list.filter((post) => post.category === category);
}

/* ---------- 7. Валидация формы ---------- */
function validatePost(data) {
  const errors = {};
  if (data.title.trim().length < 3) {
    errors.title = 'Заголовок — минимум 3 символа';
  }
  if (!data.category) {
    errors.category = 'Выберите категорию';
  }
  if (data.content.trim().length < 20) {
    errors.content = 'Текст — минимум 20 символов';
  }
  return errors;
}

function showErrors(errors) {
  const fields = {
    title: document.getElementById('title'),
    category: document.getElementById('category'),
    content: document.getElementById('content')
  };

  Object.entries(fields).forEach(([key, field]) => {
    const message = errors[key] || '';
    const errorEl = document.getElementById(`${key}-error`);
    if (errorEl) errorEl.textContent = message;
    field.classList.toggle('invalid', Boolean(message));
    field.setAttribute('aria-invalid', String(Boolean(message)));
  });
}

function clearErrors() {
  showErrors({});
}

/* ---------- 8. Инициализация ---------- */
const form = document.getElementById('add-post');
const categorySelect = document.getElementById('category');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const categoryNav = document.getElementById('categories');
let currentCategory = 'all';
let userPosts = loadUserPosts();
let allPosts = [...userPosts, ...posts];

const placeholder = document.createElement('option');
placeholder.value = '';
placeholder.textContent = '— выберите категорию —';
categorySelect.append(placeholder);

categories.forEach((cat) => {
  const opt = document.createElement('option');
  opt.value = cat.value;
  opt.textContent = cat.label;
  categorySelect.append(opt);
});

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

renderPosts(sortPostsByDate(allPosts));

/* ---------- 9. Фильтр по категориям ---------- */
if (categoryNav) {
  categoryNav.addEventListener('click', (event) => {
    const link = event.target.closest('[data-category]');
    if (!link) return;

    event.preventDefault();
    currentCategory = link.dataset.category;
    categoryNav.querySelectorAll('a').forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
    renderPosts(sortPostsByDate(filterByCategory(allPosts, currentCategory)));
  });
}

/* ---------- 10. Добавление записи ---------- */
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = {
    title: titleInput.value.trim(),
    category: categorySelect.value,
    content: contentInput.value.trim()
  };

  const errors = validatePost(data);
  showErrors(errors);

  if (Object.keys(errors).length > 0) {
    const firstInvalid = form.querySelector('.invalid');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const newPost = {
    id: Date.now(),
    title: data.title,
    content: data.content,
    category: data.category,
    date: new Date().toISOString().slice(0, 10),
    author: 'Алиев Махмуд'
  };

  userPosts.unshift(newPost);
  allPosts = [...userPosts, ...posts];
  saveUserPosts(userPosts);
  renderPosts(sortPostsByDate(filterByCategory(allPosts, currentCategory)));

  form.reset();
  clearErrors();
  titleInput.focus();
});
