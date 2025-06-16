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
    date_naissance DATE
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

INSERT IGNORE INTO users (user_id, name, first_name, username, email, phone, biography, password, date_naissance)
VALUES
(1, 'Dupont', 'Jean', 'jdupont', 'jean.dupont@email.com', '0612345678', 'Passionné de randonnée et de photographie.', 'password123', '1990-05-12'),
(2, 'Martin', 'Sophie', 'smartin', 'sophie.martin@email.com', '0623456789', 'Amatrice de cuisine et de voyages.', 'securePass45', '1985-10-23'),
(3, 'Bernard', 'Lucas', 'lbernard', 'lucas.bernard@email.com', NULL, 'Fan de cinéma et de musique.', 'strongPass78', '1992-08-17'),
(4, 'Leroy', 'Emma', 'eleroy', 'emma.leroy@email.com', '0634567890', 'Adepte du sport et du bien-être.', 'superSecure99', '1998-02-05'),
(5, 'Giraud', 'Hugo', 'hgiraud', 'hugo.giraud@email.com', '0645678901', NULL, 'passHugo21', '1995-07-30'),
(6, 'Fournier', 'Alice', 'afournier', 'alice.fournier@email.com', NULL, 'Passionnée de lecture.', 'alicePass77', '1991-11-15'),
(7, 'Roux', 'Thomas', 'troux', 'thomas.roux@email.com', '0656789012', 'Geek et amateur de jeux vidéo.', 'gamingRoux123', '1993-06-21'),
(8, 'Morel', 'Clara', 'cmorel', 'clara.morel@email.com', '0667890123', 'Grande voyageuse toujours en quête de nouvelles aventures.', 'claraLove99', '1987-09-09'),
(9, 'Fabre', 'Nathan', 'nfabre', 'nathan.fabre@email.com', NULL, 'Fan de science-fiction et de romans fantastiques.', 'nathanSecret11', '2000-12-03'),
(10, 'Lopez', 'Camille', 'clopez', 'camille.lopez@email.com', '0678901234', NULL, 'camilleTop56', '1996-04-18');

INSERT IGNORE INTO roles (role_id, role_name) VALUES
(1, 'user'),
(2, 'moderateur'),
(3, 'admin');


DELIMITER $$

DROP PROCEDURE IF EXISTS InsertUserRoles$$
CREATE PROCEDURE InsertUserRoles()
BEGIN
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = 1) THEN
        INSERT INTO user_roles (user_id, role_id) VALUES
        (1, 3), (1, 1),
        (2, 1),
        (3, 2), (3, 1),
        (4, 1),
        (5, 3), (5, 1),
        (6, 1),
        (7, 2), (7, 1),
        (8, 1),
        (9, 1),
        (10, 3), (10, 1);
    END IF;
END$$

DELIMITER ;

CALL InsertUserRoles();