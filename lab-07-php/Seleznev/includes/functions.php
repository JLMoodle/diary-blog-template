<?php
/**
 * includes/functions.php — вспомогательные функции (лаба 7).
 *
 * ВНИМАНИЕ: всё, что попадает на страницу, выводится только через e().
 */

/**
 * Экранирование вывода: спецсимволы превращаются в HTML-сущности.
 * Этим закрывается XSS ещё на лабе 7 (подробно — лаба 14).
 */
function e(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * Массив записей блога.
 * TODO лаба 7: замените примеры на свои записи (минимум 5).
 */
function getPosts(): array
{
    return [
        [
            'id'       => 1,
            'title'    => 'Изучение GitHub',
            'content'  => 'Описание того, как и с чего я начал изучение GitHub',
            'category' => 'study',
            'date'     => '2026-09-01',
        ],
        [
            'id'       => 2,
            'title'    => 'Знакомство с HTML',
            'content'  => 'Первые шаги в изучении HTML и его особенностей',
            'category' => 'study',
            'date'     => '2026-10-08',
        ],
        [
            'id'       => 3,
            'title'    => 'Использование Visual Studio Code',
            'content'  => 'Базовые навыки работы в Visual Studio Code, чем удобен при работе с кодом и почему именно он',
            'category' => 'tech',
            'date'     => '2026-09-03',
        ],
        [
            'id'       => 4,
            'title'    => 'Первый репозиторий',
            'content'  => 'Создание первого репозитория в GitHub, какие возникли трудости и какие навыки освоил',
            'category' => 'projects',
            'date'     => '2026-10-02',
        ],
        [
            'id'       => 5,
            'title'    => 'CSS и JavaScript',
            'content'  => 'Изучение принципов работы CSS и JavaScript, попытка применения их на практике',
            'category' => 'study',
            'date'     => '2026-10-16',
        ],
    ];
}