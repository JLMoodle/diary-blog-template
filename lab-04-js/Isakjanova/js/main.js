/* ============================================================
   main.js — скелет лабы 4. Каждый TODO заполняется студентом.
   ============================================================ */

/* ---------- 1. Данные: массив записей ---------- */

const posts = [
  {
    id: 1,
    title: 'Моя учёба в университете',
    content: 'Я учусь в университете и изучаю информационные системы и технологии.',
    category: 'study',
    date: '2026-11-20',
    author: 'Диёра Исакжанова'
  },
  {
    id: 2,
    title: 'Изучение JavaScript',
    content: 'Сегодня я изучаю JavaScript, переменные, массивы и функции.',
    category: 'study',
    date: '2026-11-22',
    author: 'Диёра Исакжанова'
  },
  {
    id: 3,
    title: 'Моё любимое хобби',
    content: 'В свободное время я люблю смотреть интересные сериалы.',
    category: 'hobby',
    date: '2026-11-18',
    author: 'Диёра Исакжанова'
  },
  {
    id: 4,
    title: 'Информационные технологии',
    content: 'Информационные технологии помогают людям работать с данными и обмениваться информацией.',
    category: 'tech',
    date: '2026-11-24',
    author: 'Диёра Исакжанова'
  },
  {
    id: 5,
    title: 'Мои планы на будущее',
    content: 'Я хочу получить хорошие знания, научиться программировать и создавать сайты.',
    category: 'life',
    date: '2026-11-25',
    author: 'Диёра Исакжанова'
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

  container.innerHTML = list.map(post => `
    <article class="post">
      <h2>${post.title}</h2>
      <p>${post.content}</p>
      <p>Категория: ${post.category}</p>
      <p>Дата: ${post.date}</p>
      <p>Автор: ${post.author}</p>
    </article>
  `).join('');
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
  }

  return list.filter(post => post.category === category);
}

/* ---------- 6. Запуск ---------- */
renderPosts(sortPostsByDate(posts));

/* ---------- 7. Год в подвале ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());