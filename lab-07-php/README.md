# Лабораторная работа №7 — PHP. Старт серверной части

## Цель
Перевести блог со статики (HTML) на серверный рендеринг PHP: данные записей переедут
в массив PHP, а страницы будут собираться из общих фрагментов (`includes/`) и печататься
циклом. Заодно — познакомиться с `require`, переменными, массивами и циклами PHP.

## Что реализуем (чек-лист)
- [ ] `includes/functions.php` — функция `e()` (экранирование) и `getPosts()` (массив записей).
- [ ] `includes/header.php` — шапка сайта (DOCTYPE, `<head>`, шапка, меню) с `$pageTitle`.
- [ ] `includes/footer.php` — подвал, закрывающие теги, подключение `js/main.js`.
- [ ] `index.php` — главная: `require` шапки/подвала, цикл `foreach` по записям.
- [ ] Все записи «ваши» (минимум 5), экранируются выводом через `e()`.
- [ ] `README.md` этого модуля заполнен: как запускать `php -S localhost:8000`.

## Пошагово
1. Создайте `includes/functions.php`:
   ```php
   <?php
   function e(?string $value): string {
       return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
   }
   function getPosts(): array {
       return [
           ['id' => 1, 'title' => 'Как начать дневник', 'content' => '…',
            'category' => 'life', 'date' => '2026-09-01'],
           // ещё минимум 4 записи — ваши
       ];
   }
   ```
2. `includes/header.php` — перенесите шапку из лабы 2, `<title><?= e($pageTitle ?? 'Мой дневник') ?></title>`.
3. `includes/footer.php` — подвал + `</body></html>`.
4. `index.php`:
   ```php
   <?php
   require __DIR__ . '/includes/functions.php';
   $pageTitle = 'Главная';
   require __DIR__ . '/includes/header.php';
   $posts = getPosts();
   ?>
   <main class="layout">
     <?php foreach ($posts as $post): ?>
       <article class="post">
         <h3><?= e($post['title']) ?></h3>
         <time datetime="<?= e($post['date']) ?>"><?= e($post['date']) ?></time>
         <p><?= e($post['content']) ?></p>
       </article>
     <?php endforeach; ?>
   </main>
   <?php require __DIR__ . '/includes/footer.php'; ?>
   ```
5. Проверка в терминале: `php -S localhost:8000` → открыть `http://localhost:8000`.

## Самопроверка
- Почему нужен `e()` даже для «своих» данных? Когда это станет критично?
- Чем `require` отличается от `include`? Когда использовать `require`?
- Почему `<?=` — это короткая запись чего? Включите в README модуля.

## Критерий «зачтено»
- Главная выводит ≥5 записей из PHP-массива циклом; шапка/подвал — через `require`;
- весь вывод экранирован `e()`; запускается через `php -S`.

## Как отправить
```bash
cd diary-blog
git add .
git commit -m "[lab-07] PHP: массив записей, includes, эrанение вывода"
git tag lab-07 && git push && git push --tags
```
Сдаёте: тег `lab-07` + ссылка `https://github.com/<ваш ник>/diary-blog/tree/lab-07`.
