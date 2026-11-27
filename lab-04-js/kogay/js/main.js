/* ============================================================
   main.js — скелет лабы 4. Каждый TODO заполняется студентом.
   ============================================================ */

/* ---------- 1. Данные: массив записей ---------- */
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

/* ---------- 2. Список категорий (для меню сайдбара) ---------- */
const categories = ['study', 'hobby', 'tech', 'life'];

/* ---------- 3. Функция вывода записей ---------- */
function renderPosts(list) {
  const container = document.getElementById('posts');

  if (list.length === 0) {
    container.innerHTML = '<p>Записей нет.</p>';
    return;
  }

  const postsHTML = list.map(post => `
    <article class="post">
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <p><strong>Категория:</strong> ${post.category}</p>
      <p><strong>Дата:</strong> ${post.date}</p>
      <p><strong>Автор:</strong> ${post.author}</p>
    </article>
  `).join('');

  container.innerHTML = postsHTML;
}

/* ---------- 4. Сортировка по дате (новая сверху), без мутации оригинала ---------- */
function sortPostsByDate(list) {
  return [...list].sort((a, b) => {
    return b.date.localeCompare(a.date);
  });
}

/* ---------- 5. Фильтр по категории ---------- */
function filterByCategory(list, category) {
  if (category === '') {
    return list;
  } else {
    return list.filter(post => post.category === category);
  }
}

/* ---------- 6. Запуск ---------- */
renderPosts(sortPostsByDate(posts));

/* ---------- 7. Год в подвале ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ---------- 8. Фильтрация по категориям ---------- */
const categoryLinks = document.querySelectorAll('[data-category]');

categoryLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();

    const category = link.dataset.category;
    const filteredPosts = filterByCategory(posts, category);

    renderPosts(sortPostsByDate(filteredPosts));
  });
});