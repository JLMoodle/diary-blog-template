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

INSERT INTO posts (title, content) VALUES
  ('Как начать дневник', 'Первая запись: зачем я веду дневник и что в нём будет.'),
  ('Подключение к MySQL', 'Настроил базу diary_db, проверил DSN с utf8mb4 и режимы ошибок PDO.'),
  ('Зачем нужен .env и getenv()', 'Вынес параметры подключения к БД в переменные окружения, чтобы не хранить пароли в коде.'),
  ('Сортировка записей по дате создания', 'Использую ORDER BY created_at DESC в запросе к posts, чтобы свежие записи были сверху.'),
  ('Вечерняя прогулка без гаджетов', 'Провёл час на свежем воздухе, обдумал план задач на неделю и отдохнул от экрана.'),
  ('Идеи для следующих лабораторных', 'Наметил шаги для расширения схемы БД и работы с подготовленными запросами.');