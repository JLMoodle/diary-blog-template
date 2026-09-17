-- =====================================================================
-- Блог-дневник «Мой дневник» — схема базы данных
-- Изучается и дорабатывается в лабах 9–10.
-- Создать БД можно одной командой (phpMyAdmin или mysql CLI):
--   mysql -u root -p < database/schema.sql
-- =====================================================================

CREATE DATABASE IF NOT EXISTS diary_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE diary_db;

-- ---------------------------------------------------------------------
-- Таблица 1. users — авторы и посетители блога
-- PK: id. UNIQUE: email (нельзя зарегистрировать один email дважды).
-- password_hash хранит НЕ пароль, а его хеш (лаба 14)!
-- ---------------------------------------------------------------------
CREATE TABLE users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username      VARCHAR(50)  NOT NULL,
  email         VARCHAR(120) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('admin','author','reader') NOT NULL DEFAULT 'reader',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Таблица 2. categories — категории записей
-- slug — короткое имя для URL (/category/study), UNIQUE.
-- ---------------------------------------------------------------------
CREATE TABLE categories (
  id      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name    VARCHAR(80)  NOT NULL,
  slug    VARCHAR(80)  NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_slug (slug)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Таблица 3. posts — записи блога
-- FK: user_id -> users.id, category_id -> categories.id.
-- ON DELETE RESTRICT мешает удалить автора/категорию, пока есть записи.
-- status: draft/private/published (готовится в лабе 10).
-- Индексы: по category_id (частая фильтрация) и created_at (сортировка).
-- ---------------------------------------------------------------------
CREATE TABLE posts (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  title       VARCHAR(200) NOT NULL,
  content     MEDIUMTEXT   NOT NULL,
  status      ENUM('draft','published') NOT NULL DEFAULT 'draft',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
              ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_posts_category (category_id),
  KEY idx_posts_created (created_at),
  CONSTRAINT fk_posts_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_posts_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  FULLTEXT KEY ft_posts_title_content (title, content)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Таблица 4. comments — комментарии к записям
-- FK по двум направлениям. ON DELETE CASCADE: удалили запись —
-- вместе с ней удаляются её комментарии.
-- ---------------------------------------------------------------------
CREATE TABLE comments (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  post_id    INT UNSIGNED NOT NULL,
  user_id    INT UNSIGNED NOT NULL,
  body       TEXT         NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_comments_post (post_id),
  CONSTRAINT fk_comments_post
    FOREIGN KEY (post_id) REFERENCES posts (id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_comments_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Начальные (seed) данные: админ, пара категорий и записей (лаба 9–11)
-- ---------------------------------------------------------------------
INSERT INTO categories (name, slug) VALUES
  ('Учёба',   'study'),
  ('Хобби',   'hobby'),
  ('Технологии', 'tech');

-- admin / пароль admin123 — в лабе 14 заменить на password_hash()!
INSERT INTO users (username, email, password_hash, role) VALUES
  ('admin', 'admin@diary.local', 'admin123', 'admin');