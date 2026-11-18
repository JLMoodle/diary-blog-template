/* ============================================================
   main.js — решение лабораторной работы №4
   ============================================================ */

/* ---------- 1. Данные: массив записей (минимум 5) ---------- */
const posts = [
    {
      id: 1,
      title: 'Первые шаги в веб-разработке',
      content: 'Сегодня я начал изучать основы HTML и структуру веб-страниц.',
      category: 'study',
      date: '2026-03-30',
      author: 'Никита'
    },
    {
      id: 2,
      title: 'Мои любимые хобби и увлечения',
      content: 'В свободное время я играю в игры, иногда могу и взяться за лабораторные работы.',
      category: 'hobby',
      date: '2026-03-28',
      author: 'Никита'
    },
    {
      id: 3,
      title: 'Интересный факт о мотивации',
      content: 'Только сейчас я начал выполнение работ по оптимизации, надо найти мотивацию доделать:Ъ',
      category: 'life',
      date: '2026-03-28',
      author: 'Никита'
    },
    {
      id: 4,
      title: 'Изучаем основы JavaScript',
      content: 'Познакомился с переменными const и let, а также научился писать первые функции.',
      category: 'study',
      date: '2026-04-02',
      author: 'Никита'
    },
    {
      id: 5,
      title: 'Настройка рабочего окружения',
      content: 'Полезные плагины для редактора кода, которые упрощают разработку сайтов.',
      category: 'tech',
      date: '2026-04-05',
      author: 'Никита'
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
  
    let html = '';
    for (let i = 0; i < list.length; i++) {
      const post = list[i];
      html += `
        <article class="post">
          <h3>${post.title}</h3>
          <p><time datetime="${post.date}">${post.date}</time> | Категория: <strong>${post.category}</strong></p>
          <p>${post.content}</p>
          <a href="#" class="read-more">Читать далее</a>
        </article>
      `;
    }
    container.innerHTML = html;
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