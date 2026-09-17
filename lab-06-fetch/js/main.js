/* ============================================================
   lab-06-fetch/js/main.js — Лана 6 ⦋fetch() строка + JSON⦌
   TODO: допишите по методичке в lab-06-fetch/README.md
   ============================================================ */

const postsContainer = document.getElementById('posts');

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
    .then((posts) => renderPosts(posts))
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

loadPosts();
