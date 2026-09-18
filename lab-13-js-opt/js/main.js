/* ============================================================
   js/main.js — скелет лабы 13 (оптимизация JavaScript).
   Делегирование событий, debounce, throttle, DocumentFragment.
   TODO: допишите по методичке в lab-13-js-opt/README.md
   ============================================================ */

/* ---------- 1. Делегирование: ОДИН обработчик на контейнер ----------
   Вместо обработчика на каждой карточке/кнопке — один на #posts.
   Клик «всплывает» от цели к контейнеру, e.target.closest('[data-action]')
   находит кнопку, даже если она добавлена ПОСЛЕ навешивания обработчика.
*/
document.getElementById('posts').addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-action]');
  if (!trigger) return;

  const id = trigger.dataset.id;
  const action = trigger.dataset.action;

  // TODO: выполнить нужное действие по `action` (delete / like / open…)
  console.log('Действие', action, 'над записью', id);
});

/* ---------- 2. Debounce: сработать, когда ввод «успокоился» ---------- */
function debounce(fn, delay = 300) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
}

const searchInput = document.getElementById('search');
if (searchInput) {
  searchInput.addEventListener('input', debounce((event) => {
    // TODO: живой фильтр — НЕ дёргаем сервер на каждую букву
    renderPosts(filterPosts(event.target.value));
  }, 300));
}

/* ---------- 3. Throttle по requestAnimationFrame ---------- */
function onScroll() {
  // TODO: тяжёлые расчёты (позиции, ленивые картинки) — раз на кадр
}

window.addEventListener('scroll', () => {
  requestAnimationFrame(onScroll);
});

/* ---------- 4. Рендер через DocumentFragment: один касание DOM ---------- */
function renderPosts(list) {
  const container = document.getElementById('posts');
  const fragment = document.createDocumentFragment();

  if (list.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Записей нет.';
    fragment.append(empty);
  } else {
    // TODO: list.forEach(post => fragment.append(createPostElement(post)));
  }

  // Один replaceChildren вместо N append (и без `container.innerHTML +=`)
  container.replaceChildren(fragment);
}

/* ---------- 5. Фильтр (заготовка для debounce выше) ---------- */
function filterPosts(query) {
  if (!query) return allPosts;
  return allPosts.filter((post) =>
    post.title.toLowerCase().includes(query.toLowerCase())
  );
}

/* ---------- Данные-заглушка для этой лабы ---------- */
const allPosts = [
  { id: 1, title: 'Как начать дневник', content: '…' },
  { id: 2, title: 'Стили и адаптивность', content: '…' },
];

renderPosts(allPosts);