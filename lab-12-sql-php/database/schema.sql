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
  ('Хобби', 'hobby'),
  ('Технологии', 'tech'),
  ('Жизнь', 'life');

-- TODO лаба 9: добавьте минимум 5 своих записей
INSERT INTO posts (title, content) VALUES
  ('Как начать дневник', 'Первая запись: зачем я веду дневник и что в нём будет.');