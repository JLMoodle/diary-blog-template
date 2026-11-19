<?php
/**
 * about.php — страница «О блоге» (лаба 7).
 */

require __DIR__ . '/includes/functions.php';

$pageTitle = 'О блоге — Мой дневник';
require __DIR__ . '/includes/header.php';
?>
<main class="about-page">
  <section class="about-card">
    <h2>Об авторе</h2>
    <p>Меня зовут Алиев Махмуд, я студент группы 8-24ИСиТ. Этот дневник создан в рамках лабораторных работ по дисциплине «Оптимизация клиент-серверных приложений».</p>
    <p>На этом этапе страницы собираются на PHP: шапка и подвал подключаются через <code>require</code>, а записи выводятся циклом <code>foreach</code> из массива.</p>
    <h2>Что уже реализовано</h2>
    <ul>
      <li>общие фрагменты страницы в папке <code>includes/</code>;</li>
      <li>функция <code>e()</code> для экранирования всего вывода;</li>
      <li>пять записей и вывод категорий с количеством материалов.</li>
    </ul>
    <p><a class="back-link" href="/index.php">← Вернуться к записям</a></p>
  </section>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
