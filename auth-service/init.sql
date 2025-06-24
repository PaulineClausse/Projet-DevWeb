DROP DATABASE IF EXISTS authdb;
CREATE DATABASE IF NOT EXISTS authdb;
USE authdb;
-- Crée un utilisateur MySQL avec un mot de passe
DROP USER IF EXISTS 'authuser'@'%';
CREATE USER 'authuser'@'%' IDENTIFIED BY 'Authpassword1!!';

-- Donne les droits nécessaires à l'utilisateur sur la base
GRANT ALL PRIVILEGES ON authdb.* TO 'authuser'@'%';

-- Applique les modifications de privilèges
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    biography TEXT,
    password VARCHAR(255) NOT NULL,
    date_naissance DATE,
    image VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    role_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

INSERT IGNORE INTO roles (role_id, role_name) VALUES
(1, 'user'),
(2, 'moderateur'),
(3, 'admin');