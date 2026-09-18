/* ============================================================
   main.js — скелет лабы 4. Каждый TODO заполняется студентом.
   ============================================================ */

/* ---------- 1. Данные: массив записей ---------- */
const posts = [
  /*
   * TODO: минимум 5 ваших записей. Поля:
   *   id, title, content, category, date (ГГГГ-ММ-ДД), author
   * Пример:
   * {
   *   id: 1,
   *   title: 'Как я организовал своё рабочее место',
   *   content: 'Порядок на столе — порядок в голове...',
   *   category: 'hobby',
   *   date: '2026-09-01',
   *   author: 'Ваше Имя'
   * },
   */
];

/* ---------- 2. Список категорий (для меню сайдбара) ---------- */
const categories = ['study', 'hobby', 'tech', 'life'];

/* ---------- 3. Функция вывода записей ---------- */
function renderPosts(list) {
  const container = document.getElementById('posts');

  // TODO: соберите HTML каждой записи карточкой <article class="post">…</article>
  // и присвойте container.innerHTML. Пустой список — «Записей нет».
  container.innerHTML = '';
}

/* ---------- 4. Сортировка по дате (новая сверху), без мутации оригинала ---------- */
function sortPostsByDate(list) {
  // TODO: вернуть НОВЫЙ отсортированный по date массив
  return [...list];
}

/* ---------- 5. Фильтр по категории ---------- */
function filterByCategory(list, category) {
  if (category === '') return list;
  // TODO: вернуть только записи с post.category === category
  return list;
}

/* ---------- 6. Запуск ---------- */
renderPosts(sortPostsByDate(posts));

/* ---------- 7. Год в подвале ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());