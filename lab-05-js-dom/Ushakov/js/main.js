/* ============================================================
   main.js — решение лабораторной работы №5. DOM, форма, события, localStorage.
   ============================================================ */

/* ---------- 1. Данные (перенесены 5 записей из лабы 4) ---------- */
// TODO 1: Перенесены 5 исходных записей блога
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

const categories = ['study', 'hobby', 'tech', 'life'];

/* ---------- 2. localStorage ---------- */
const STORAGE_KEY = 'diary-blog-user-posts';

function loadUserPosts() {
  // TODO 2: Прочитана JSON-строка из localStorage, выполнился парсинг, возвращен массив (или пустой массив)
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveUserPosts(list) {
  // TODO 3: Преобразование массива в JSON-строку через JSON.stringify и сохранение в localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/* ---------- 3. DOM-построение карточки (БЕЗ innerHTML) ---------- */
function createPostElement(post) {
  const card = document.createElement('article');
  card.className = 'post';

  const h3 = document.createElement('h3');
  h3.textContent = post.title;
  card.append(h3);

  // Вывод категории и даты для наглядности
  const infoP = document.createElement('p');
  const timeEl = document.createElement('time');
  timeEl.dateTime = post.date;
  timeEl.textContent = post.date;
  infoP.append(timeEl);
  
  if (post.category) {
    const catSpan = document.createElement('span');
    catSpan.textContent = ` | Категория: ${post.category}`;
    infoP.append(catSpan);
  }
  card.append(infoP);

  const p = document.createElement('p');
  p.textContent = post.content;
  card.append(p);

  return card;
}

/* ---------- 4. Рендер ---------- */
function renderPosts(list) {
  const container = document.getElementById('posts');
  container.innerHTML = '';            // очистка старых карточек
  if (list.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Записей нет. Добавьте первую';
    container.append(empty);
    return;
  }
  list.forEach(post => container.append(createPostElement(post)));
}

/* ---------- 5. Валидация формы ---------- */
function validatePost(data) {
  const errors = {};
  if (data.title.trim().length < 3) errors.title = 'Заголовок — минимум 3 символа';
  if (!data.category) errors.category = 'Выберите категорию';
  if (data.content.trim().length < 20) errors.content = 'Текст — минимум 20 символов';
  return errors;
}

function showErrors(errors) {
  // TODO 4: Для каждой ошибки выводится элемент <p class="error"> под соответствующим полем
  clearErrors(); 
  for (const field in errors) {
    const inputElement = document.getElementById(field);
    if (inputElement) {
      const errorP = document.createElement('p');
      errorP.className = 'error';
      errorP.textContent = errors[field];
      inputElement.after(errorP);
    }
  }
}

function clearErrors() {
  // TODO 5: Удаление всех элементов с классом .error со страницы
  const errorElements = document.querySelectorAll('.error');
  errorElements.forEach(el => el.remove());
}

/* ---------- 6. Инициализация ---------- */
const form = document.getElementById('add-post');
const categorySelect = document.getElementById('category');

// Заполнение выпадающего списка категорий
if (categorySelect) {
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.append(opt);
  });
}

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// TODO 6: Объединение базовых постов с пользовательскими из localStorage и первичный рендер
const userPosts = loadUserPosts();
const allPosts = [...userPosts, ...posts];
renderPosts(allPosts);

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();

    // TODO 7: Сбор данных из формы
    const formData = {
      title: document.getElementById('title').value,
      category: document.getElementById('category').value,
      content: document.getElementById('content').value
    };
    const errors = validatePost(formData);
    if (Object.keys(errors).length > 0) {
      showErrors(errors);
      return;
    }
    const newPost = {
      id: Date.now(),
      title: formData.title.trim(),
      category: formData.category,
      content: formData.content.trim(),
      date: new Date().toISOString().split('T')[0],
      author: 'Никита'
    };

    // TODO 8: Добавление в пользовательский массив, сохранение в localStorage и перерисовка списка
    userPosts.unshift(newPost);
    saveUserPosts(userPosts);

    const updatedAllPosts = [...userPosts, ...posts];
    renderPosts(updatedAllPosts);

    form.reset();
  });
}