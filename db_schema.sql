
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)

--Table for Draft Articles
CREATE TABLE IF NOT EXISTS articles(
    draID INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    created DATETIME(1) NOT NULL,
    lastModified DATETIME(1) NOT NULL,
    body LONGTEXT NOT NULL
);

--Table for Published Articles
CREATE TABLE IF NOT EXISTS pubArticles(
    pubID INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    created DATETIME(1) NOT NULL,
    published DATETIME(1) NOT NULL,
    likes INTEGER NOT NULL,
    body LONGTEXT NOT NULL
    -- FOREIGN KEY (draID) REFERENCES articles(draID)
);

--Table for Comments of a published article
CREATE TABLE IF NOT EXISTS comments(
    comID INTEGER NOT NULL,
    comPublished DATETIME(1) NOT NULL,
    comWords VARCHAR(255) NOT NULL,
    FOREIGN KEY (comID) REFERENCES pubArticles(pubID)
);

--Table for Author Settings
CREATE TABLE IF NOT EXISTS authors(
    auID INTEGER PRIMARY KEY AUTOINCREMENT,
    blogTitle VARCHAR(255) NOT NULL,
    blogSubtitle VARCHAR(255) NOT NULL,
    auName VARCHAR(255) NOT NULL
);


--insert default data (if necessary here)

--Default data for Draft Articles
INSERT INTO articles ("title", "subtitle", "created", "lastModified", "body") VALUES ("Spaghetti", "Cuisine", DATETIME("now"), DATETIME("now"), "Hi I'm Spaghetti");
INSERT INTO articles ("title", "subtitle", "created", "lastModified", "body") VALUES ("BMW", "Car", DATETIME("now"), DATETIME("now"), "Hi I'm BMW");
INSERT INTO articles ("title", "subtitle", "created", "lastModified", "body") VALUES ("Honolulu", "Island", DATETIME("now"), DATETIME("now"), "Hi I'm Honolulu");
INSERT INTO articles ("title", "subtitle", "created", "lastModified", "body") VALUES ("Pikachu", "Character", DATETIME("now"), DATETIME("now"), "Hi I'm Pikachu");
INSERT INTO articles ("title", "subtitle", "created", "lastModified", "body") VALUES ("Blue", "Color", DATETIME("now"), DATETIME("now"), "Hi I'm blue");

--Default Author Settings
INSERT INTO authors ("blogTitle", "blogSubtitle", "auName") VALUES ("Live, Laugh, Love", "Since 2023", "The Coding Buddy");

COMMIT;

