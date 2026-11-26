const posts = [
    {
        "id": "music",
        "title": "Ещё один круг",
        "category": "Музыка",
        "date": "2026-11-23",
        "content": "Самое обидное в короткой дороге — когда ты уже у подъезда, а в наушниках только начался лучший кусок трека.",
        "continuation": "Есть два варианта: выключить на полуслове или сделать круг вокруг дома. У второго есть минус. На обратном пути может начаться ещё один хороший трек.",
        "author": "Макар Смышляев"
    },
    {
        "id": "photos",
        "title": "Луна размером с пиксель",
        "category": "Фотоплёнка",
        "date": "2026-11-22",
        "content": "Глазами видишь огромную луну над крышей. Достаёшь телефон — и вот у тебя на чёрном фоне белая точка.",
        "continuation": "Такую фотку легко удалить. А потом замечаешь в нижнем углу вывеску магазина и сразу вспоминаешь, откуда смотрел. Ради этого угла пусть лежит.",
        "author": "Макар Смышляев"
    },
    {
        "id": "notes",
        "title": "Важная мысль в час ночи",
        "category": "Заметки",
        "date": "2026-11-21",
        "content": "Если ночью записать «утром пойму», утром у тебя будет ровно одна зацепка. Почерк твой.",
        "continuation": "Предлагаю правило для ночных заметок: оставлять хотя бы одно существительное. «Утром пойму про чайник» — уже какое-то начало расследования.",
        "author": "Макар Смышляев"
    },
    {
        "id": "playlist",
        "title": "Плейлист на одну остановку",
        "category": "Музыка",
        "date": "2026-11-20",
        "content": "Пока выбирал песню для короткой поездки, автобус уже подъехал к моей остановке.",
        "continuation": "На обратном пути включил первый трек ещё до посадки. Успел и припев, и свою остановку.",
        "author": "Макар Смышляев"
    },
    {
        "id": "light",
        "title": "Свет в окне напротив",
        "category": "Фотоплёнка",
        "date": "2026-11-19",
        "content": "На снимке вечернего двора одно окно получилось ярче всех фонарей.",
        "continuation": "Приблизил кадр в поисках лампы. Оказалось, стекло поймало последние минуты заката.",
        "author": "Макар Смышляев"
    }
];

const board = document.querySelector('#posts');
const windows = document.querySelector('#windows');
const categoryButtons = document.querySelectorAll('[data-category]');
const icons = { 'Музыка': 'music', 'Фотоплёнка': 'photos', 'Заметки': 'notes' };
const dateFormat = new Intl.DateTimeFormat('ru', { dateStyle: 'long', timeZone: 'UTC' });
let topLayer = 0;

function sortPostsByDate(list) {
    return [...list].sort((left, right) => right.date.localeCompare(left.date));
}

function filterByCategory(list, category) {
    if (!category) return list;
    return list.filter(post => post.category === category);
}

function element(tag, text) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    return node;
}

function postDate(post) {
    const time = element('time', dateFormat.format(new Date(post.date)));
    time.dateTime = post.date;
    return time;
}

function renderPosts(list) {
    board.replaceChildren();
    if (list.length === 0) {
        board.append(element('p', 'Записей нет.'));
        return;
    }
    for (const post of list) {
        const card = element('article');
        card.classList.add('file', icons[post.category] || 'notes');
        const heading = element('h3');
        const button = element('button');
        button.dataset.post = post.id;
        const icon = element('span');
        icon.className = 'preview';
        icon.setAttribute('aria-hidden', 'true');
        button.append(icon, element('span', post.title));
        button.addEventListener('click', () => openPost(post));
        heading.append(button);
        card.append(heading, postDate(post));
        board.append(card);
    }
}

function raiseWindow(panel) {
    panel.style.zIndex = ++topLayer;
}

function closeWindow(panel, post) {
    panel.remove();
    const remaining = [...windows.children].sort((a, b) => b.style.zIndex - a.style.zIndex);
    const nextFocus = remaining[0] || board.querySelector('[data-post="' + post.id + '"]')
        || document.querySelector('[aria-pressed="true"]');
    nextFocus.focus();
}

function openPost(post) {
    const id = 'window-' + post.id;
    const existing = document.getElementById(id);
    if (existing) {
        raiseWindow(existing);
        existing.focus();
        return;
    }
    const panel = element('section');
    panel.className = 'window';
    panel.id = id;
    panel.tabIndex = -1;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', id + '-title');
    // Reuse a free position when an earlier window has been closed.
    const used = new Set([...windows.children].map(node => Number(node.dataset.slot)));
    let slot = 0;
    while (used.has(slot)) slot++;
    panel.dataset.slot = slot;
    panel.style.setProperty('--slot', slot);
    const bar = element('header');
    bar.className = 'bar';
    const close = element('button', '×');
    close.setAttribute('aria-label', 'Закрыть запись');
    close.addEventListener('click', () => closeWindow(panel, post));
    bar.append(element('span', post.category), close);
    const paper = element('div');
    paper.className = 'paper';
    const title = element('h2', post.title);
    title.id = id + '-title';
    const details = element('details');
    details.append(element('summary', 'Продолжение записи'), element('p', post.continuation));
    paper.append(postDate(post), title, element('p', post.content), details);
    panel.append(bar, paper);
    panel.addEventListener('pointerdown', () => raiseWindow(panel));
    panel.addEventListener('focusin', () => raiseWindow(panel));
    panel.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeWindow(panel, post);
    });
    windows.append(panel);
    panel.focus();
}

for (const button of categoryButtons) {
    button.addEventListener('click', () => {
        for (const item of categoryButtons) item.setAttribute('aria-pressed', String(item === button));
        renderPosts(sortPostsByDate(filterByCategory(posts, button.dataset.category)));
    });
}
renderPosts(sortPostsByDate(posts));
