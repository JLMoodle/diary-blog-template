/* ============================================================
   Лабораторная работа №4. JavaScript: данные, функции, условия.
   Студент: Алиев Махмуд, группа 8-24ИСиТ.
   ============================================================ */

/* ---------- 1. Данные: массив записей ---------- */
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
    content: 'Разобрал различия между const и let, потренировался с массивами объектов и методами filter, sort, map. Главный вывод: функции должны получать данные аргументом, а не читать глобальные переменные.',
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
    content: 'Составил план повторения темы «Информационные технологии»: основные понятия, классификация ИТ, аппаратное и программное обеспечение. Разбил материал на небольшие блоки и повторяю по 30 минут.',
    category: 'study',
    date: '2026-10-18',
    author: 'Алиев Махмуд'
  }
];

/* ---------- 2. Справочник категорий ---------- */
const categoryNames = {
  study: 'Учёба',
  hobby: 'Хобби',
  tech: 'Технологии',
  life: 'Жизнь'
};

/* ---------- 3. Вспомогательные функции ---------- */
function formatDate(isoDate) {
  const parts = isoDate.split('-');
  return parts.length === 3 ? `${parts[2]}.${parts[1]}.${parts[0]}` : isoDate;
}

/* ---------- 4. Вывод записей ---------- */
function renderPosts(list) {
  const container = document.getElementById('posts');
  if (!container) return;

  // Пустой список — отдельное сообщение, страница не «падает».
  if (!Array.isArray(list) || list.length === 0) {
    container.innerHTML = '<p class="empty">Записей нет.</p>';
    return;
  }

  container.innerHTML = list.map((post) => {
    const category = categoryNames[post.category] || post.category;
    return `
      <article class="post">
        <h3>${post.title}</h3>
        <p class="post-meta">
          <time datetime="${post.date}">${formatDate(post.date)}</time>
          <span class="tag">${category}</span>
          <span>${post.author}</span>
        </p>
        <p>${post.content}</p>
      </article>
    `;
  }).join('');
}

/* ---------- 5. Сортировка по дате (новая сверху) ---------- */
function sortPostsByDate(list) {
  // [...list] создаёт копию, поэтому исходный массив не меняется.
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
}

/* ---------- 6. Фильтр по категории ---------- */
function filterByCategory(list, category) {
  if (!category || category === 'all') return list;
  return list.filter((post) => post.category === category);
}

/* ---------- 7. Запуск ---------- */
renderPosts(sortPostsByDate(posts));

/* ---------- 8. Фильтр в боковом меню ---------- */
const categoryNav = document.getElementById('categories');
if (categoryNav) {
  categoryNav.addEventListener('click', (event) => {
    const link = event.target.closest('[data-category]');
    if (!link) return;

    event.preventDefault();
    const category = link.dataset.category;

    categoryNav.querySelectorAll('a').forEach((item) => item.classList.remove('active'));
    link.classList.add('active');

    const filtered = filterByCategory(posts, category);
    renderPosts(sortPostsByDate(filtered));
  });
}

/* ---------- 9. Год в подвале ---------- */
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}
