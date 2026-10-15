const posts = [
  {
    id: 1,
    title: 'Изучение GitHub',
    content: 'Описание того, как и с чего я начал изучение GitHub',
    category: 'study',
    date: '2026-09-01',
    author: 'Максим Селезнев'
  },
  {
    id: 2,
    title: 'Знакомство с HTML',
    content: 'Первые шаги в изучении HTML и его особенностей',
    category: 'study',
    date: '2026-10-08',
    author: 'Максим Селезнев'
  },
  {
    id: 3,
    title: 'Использование Visual Studio Code',
    content: 'Базовые навыки работы в Visual Studio Code, чем удобен при работе с кодом и почему именно он',
    category: 'tech',
    date: '2026-09-03',
    author: 'Максим Селезнев'
  },
  {
    id: 4,
    title: 'Первый репозиторий',
    content: 'Создание первого репозитория в GitHub, какие возникли трудости и какие навыки освоил',
    category: 'projects',
    date: '2026-10-02',
    author: 'Максим Селезнев'
  },
  {
    id: 5,
    title: 'CSS и JavaScript',
    content: 'Изучение принципов работы CSS и JavaScript, попытка применения их на практике',
    category: 'study',
    date: '2026-10-16',
    author: 'Максим Селезнев'
  }
];

/* ---------- 2. Список категорий (для меню сайдбара) ---------- */
const categories = ['study', 'projects', 'tech'];

/* ---------- 3. Функция вывода записей ---------- */
function renderPosts(list) {
  const container = document.getElementById('posts');
  if (list.length === 0) {
    container.innerHTML = '<p>Записей нет.</p>';
    return;
}
const postsHTML = list.map(post => {
  return `
      <article class="post">
        <h3>${post.title}</h3>
        <time datetime="${post.date}">${post.date}</time>
        <p>${post.content}</p>
        <p>Автор: ${post.author}</p>
        <a class="read-more" href="#">Читать далее</a>
      </article>
  `;
}).join('');

container.innerHTML = postsHTML;
}

/* ---------- 4. Сортировка по дате (новая сверху), без мутации оригинала ---------- */
function sortPostsByDate(list) {
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
}

/* ---------- 5. Фильтр по категории ---------- */
function filterByCategory(list, category) {
    if (category === '') return list;

    return list.filter(post => post.category === category);
}

/* ---------- 6. Запуск ---------- */
renderPosts(sortPostsByDate(posts));

/* ---------- 7. Год в подвале ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());