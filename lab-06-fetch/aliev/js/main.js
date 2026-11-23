/* ============================================================
   Лабораторная работа №6. Fetch API, JSON, async/await.
   Студент: Алиев Махмуд, группа 8-24ИСиТ.
   ============================================================ */

const postsContainer = document.getElementById('posts');
const categoryNav = document.getElementById('categories');

let allPosts = [];
let currentCategory = 'all';

const categoryNames = {
  study: 'Учёба',
  hobby: 'Хобби',
  tech: 'Технологии',
  life: 'Жизнь'
};

function formatDate(isoDate) {
  const parts = isoDate.split('-');
  return parts.length === 3 ? `${parts[2]}.${parts[1]}.${parts[0]}` : isoDate;
}

/* ---------- 1. Состояния загрузки ---------- */
function showLoading() {
  postsContainer.replaceChildren();
  const message = document.createElement('p');
  message.className = 'empty';
  message.textContent = 'Загрузка записей…';
  postsContainer.append(message);
}

function showError(message) {
  postsContainer.replaceChildren();
  const errorBox = document.createElement('p');
  errorBox.className = 'empty error-box';
  errorBox.textContent = message;
  postsContainer.append(errorBox);
}

/* ---------- 2. Загрузка данных через fetch ---------- */
async function loadPosts() {
  showLoading();
  try {
    const response = await fetch('data/posts.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Некорректный формат JSON');
    }
    allPosts = data;
    renderPosts(sortPostsByDate(filterPosts(allPosts)));
  } catch (error) {
    console.error('Не удалось загрузить записи:', error);
    showError('Ошибка загрузки. Не удалось получить данные с сервера.');
  }
}

/* ---------- 3. Рендер карточки (textContent, без innerHTML) ---------- */
function renderPost(post) {
  const article = document.createElement('article');
  article.className = 'post';

  const h3 = document.createElement('h3');
  h3.textContent = post.title;
  article.append(h3);

  const meta = document.createElement('p');
  meta.className = 'post-meta';

  const time = document.createElement('time');
  time.dateTime = post.date;
  time.textContent = formatDate(post.date);

  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.textContent = categoryNames[post.category] || post.category || 'без категории';

  const author = document.createElement('span');
  author.textContent = post.author || 'Алиев Махмуд';

  meta.append(time, tag, author);
  article.append(meta);

  const p = document.createElement('p');
  p.textContent = post.content;
  article.append(p);

  return article;
}

/* ---------- 4. Список на страницу ---------- */
function renderPosts(posts) {
  postsContainer.replaceChildren();
  if (!Array.isArray(posts) || posts.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'Записей пока нет.';
    postsContainer.append(empty);
    return;
  }
  posts.forEach((post) => postsContainer.append(renderPost(post)));
}

/* ---------- 5. Сортировка копии по дате (новая сверху) ---------- */
function sortPostsByDate(list) {
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
}

/* ---------- 6. Фильтр по категории ---------- */
function filterPosts(list) {
  if (currentCategory === 'all') return list;
  return list.filter((post) => post.category === currentCategory);
}

/* ---------- 7. Категории в сайдбаре ---------- */
if (categoryNav) {
  categoryNav.addEventListener('click', (event) => {
    const link = event.target.closest('[data-category]');
    if (!link) return;

    event.preventDefault();
    currentCategory = link.dataset.category;
    categoryNav.querySelectorAll('a').forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
    renderPosts(sortPostsByDate(filterPosts(allPosts)));
  });
}

/* ---------- 8. Год в подвале ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

loadPosts();
