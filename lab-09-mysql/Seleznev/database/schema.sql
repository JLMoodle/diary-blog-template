-- ============================================================
-- diary_db — схема к лабораторной №9.
-- В лабе 10 этот файл расширяется до полной схемы
-- (users, comments, FK, индексы, FULLTEXT, ENUM).
-- Файл пере-импортируемый: CREATE DATABASE / TABLE IF NOT EXISTS.
-- ============================================================

CREATE DATABASE IF NOT EXISTS diary_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE diary_db;

CREATE TABLE IF NOT EXISTS categories (
  id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS posts (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(200) NOT NULL,
  content    TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name, slug) VALUES
  ('Учёба', 'study'),
  ('Проекты', 'projects'),
  ('Технологии', 'tech');

-- TODO лаба 9: добавьте минимум 5 своих записей
INSERT INTO posts (title, content, created_at) VALUES
(
    'Изучение GitHub',
    'Описание того, как и с чего я начал изучение GitHub',
    '2026-09-01 00:00:00'
),
(
    'Знакомство с HTML',
    'Первые шаги в изучении HTML и его особенностей',
    '2026-10-08 00:00:00'
),
(
    'Использование Visual Studio Code',
    'Базовые навыки работы в Visual Studio Code, чем удобен при работе с кодом и почему именно он',
    '2026-09-03 00:00:00'
),
(
    'Первый репозиторий',
    'Создание первого репозитория в GitHub, какие возникли трудности и какие навыки освоил',
    '2026-10-02 00:00:00'
),
(
    'CSS и JavaScript',
    'Изучение принципов работы CSS и JavaScript, попытка применения их на практике',
    '2026-10-16 00:00:00'
);