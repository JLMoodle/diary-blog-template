-- ============================================================
-- diary_db — ПОЛНАЯ схема (результат лабы 10, эталон для лабы 14).
-- таблицы users, categories, posts, comments; FK, UNIQUE, ENUM,
-- индексы (created_at, FK-колонки), FULLTEXT для поиска (лаба 12).
-- Файл пере-импортируемый: CREATE ... IF NOT EXISTS.
-- ============================================================

CREATE DATABASE IF NOT EXISTS diary_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE diary_db;

-- ---------- users ----------
-- email и username уникальны: без этого два «одинаковых» аккаунта
-- сломали бы вход и авторство.
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('reader', 'author', 'admin') NOT NULL DEFAULT 'author',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------- categories ----------
CREATE TABLE IF NOT EXISTS categories (
  id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE
);

-- ---------- posts ----------
-- user_id/category_id: SET NULL — если пользователь/категория удалены,
-- сама запись остаётся. status: draft/published через ENUM.
CREATE TABLE IF NOT EXISTS posts (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NULL,
  category_id INT UNSIGNED NULL,
  title       VARCHAR(200) NOT NULL,
  content     TEXT NOT NULL,
  status      ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_posts_user     FOREIGN KEY (user_id)
    REFERENCES users (id)     ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_posts_category FOREIGN KEY (category_id)
    REFERENCES categories (id) ON DELETE SET NULL ON UPDATE CASCADE,

  INDEX idx_posts_created (created_at),
  INDEX idx_posts_cat     (category_id),
  FULLTEXT INDEX ft_posts_search (title, content)  -- поиск лабы 12
);

-- ---------- comments ----------
-- post_id: CASCADE — комментарий не может жить без записи.
CREATE TABLE IF NOT EXISTS comments (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  post_id    INT UNSIGNED NOT NULL,
  user_id    INT UNSIGNED NULL,
  content    TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_comments_post FOREIGN KEY (post_id)
    REFERENCES posts (id)    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id)
    REFERENCES users (id)    ON DELETE SET NULL ON UPDATE CASCADE,

  INDEX idx_comments_post (post_id)
);

-- ---------- Стартовые данные (дополните своими, лаба 9) ----------
INSERT INTO categories (name, slug) VALUES
  ('Учёба', 'study'),
  ('Хобби', 'hobby'),
  ('Технологии', 'tech'),
  ('Жизнь', 'life');