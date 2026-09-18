<?php
/**
 * includes/functions.php — вспомогательные функции (лабы 7 и 8).
 *
 * ВНИМАНИЕ: всё, что попадает на страницу, выводится только через e().
 */

/**
 * Экранирование вывода: спецсимволы превращаются в HTML-сущности.
 */
function e(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * Белый список категорий: значение из формы принимается, только если
 * оно есть в этом списке (лаба 8). TODO: сделайте свой список.
 */
function getCategories(): array
{
    return ['study', 'hobby', 'tech', 'life'];
}

/**
 * Массив записей блога.
 * TODO: замените примеры на свои записи (минимум 5).
 */
function getPosts(): array
{
    return [
        [
            'id'       => 1,
            'title'    => 'Как начать дневник',
            'content'  => 'Первая запись: зачем я веду дневник и что в нём будет.',
            'category' => 'life',
            'date'     => '2026-09-01',
        ],
        [
            'id'       => 2,
            'title'    => 'Каркас на HTML5',
            'content'  => 'Семантическая разметка: header, nav, main, aside, footer.',
            'category' => 'study',
            'date'     => '2026-09-03',
        ],
        [
            'id'       => 3,
            'title'    => 'Стили и адаптивность',
            'content'  => 'CSS-переменные, Flexbox/Grid, медиазапросы. Страница не разваливается на телефоне.',
            'category' => 'hobby',
            'date'     => '2026-09-05',
        ],
        [
            'id'       => 4,
            'title'    => 'Оживили JavaScript',
            'content'  => 'Данные в массиве, renderPosts, фильтр по категории и сортировка по дате.',
            'category' => 'tech',
            'date'     => '2026-09-07',
        ],
        [
            'id'       => 5,
            'title'    => 'DOM, форма и localStorage',
            'content'  => 'Добавление записи через форму, валидация, сохранение между перезагрузками.',
            'category' => 'life',
            'date'     => '2026-09-09',
        ],
    ];
}