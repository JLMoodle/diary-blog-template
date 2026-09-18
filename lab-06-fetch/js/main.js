/* ============================================================
   lab-06-fetch/js/main.js — Лаба 6: fetch() + JSON
   Данные грузятся из data/posts.json; работает фильтр по категориям
   (идеи лабы 4), форма лабы 5 подключается при желании.
   ============================================================ */

const postsContainer = document.getElementById('posts');
const categoryNav = document.getElementById('categories');

let allPosts = [];
let currentCategory = 'all';

/* ---------- 1. fetch(): путь к данным ---------- */
function loadPosts() {
  postsContainer.textContent = 'Загружаю записи…';

  fetch('data/posts.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('HTTP ' + response.status + ' ' + response.statusText);
      }
      return response.json();
    })
    .then((posts) => {
      allPosts = posts;
      renderPosts(sortPostsByDate(allPosts));
    })
    .catch((error) => {
      postsContainer.textContent = 'Не удалось загрузить записи: ' + error.message;
    });
}

/* ---------- 2. Рендер карточки (textContent, не innerHTML) ---------- */
function renderPost(post) {
  const article = document.createElement('article');
  article.className = 'post';

  const h3 = document.createElement('h3');
  h3.textContent = post.title;
  article.append(h3);

  const time = document.createElement('time');
  time.dateTime = post.date;
  time.textContent = post.date + ' · ' + (post.category || 'без категории');
  article.append(time);

  const p = document.createElement('p');
  p.textContent = post.content;
  article.append(p);

  return article;
}

/* ---------- 3. Список на страницу ---------- */
function renderPosts(posts) {
  postsContainer.replaceChildren();
  if (posts.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Записей пока нет.';
    postsContainer.append(empty);
    return;
  }
  posts.forEach((post) => postsContainer.append(renderPost(post)));
}

/* ---------- 4. Сортировка копии по дате (новая сверху, лаба 4) ---------- */
function sortPostsByDate(list) {
  return [...list].sort((a, b) => (a.date < b.date ? 1 : -1));
}

/* ---------- 5. Фильтр по категории (лаба 4) ---------- */
function filterPosts(list) {
  if (currentCategory === 'all') return list;
  return list.filter((post) => post.category === currentCategory);
}

/* ---------- 6. Категории в сайдбаре: делегирование клика ---------- */
if (categoryNav) {
  categoryNav.addEventListener('click', (event) => {
    const link = event.target.closest('[data-category]');
    if (!link) return;

    currentCategory = link.dataset.category;
    categoryNav.querySelectorAll('a').forEach((item) => item.classList.remove('active'));
    link.classList.add('active');

    renderPosts(sortPostsByDate(filterPosts(allPosts)));
  });
}

/* ---------- 7. Год в подвале ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

loadPosts();