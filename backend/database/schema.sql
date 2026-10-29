-- Active: 1790030393395@@127.0.0.1@3306@screeni
-- Drop all tables
DROP TABLE IF EXISTS Watchlist_items;

DROP TABLE IF EXISTS Movies;

DROP TABLE IF EXISTS Shows;

DROP TABLE IF EXISTS Media_items;

DROP TABLE IF EXISTS Users;

-- Create Users Table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);

-- Create media items table
CREATE TABLE Media_items (
    media_item_id INT AUTO_INCREMENT,
    tmdb_id INT NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    type ENUM('movie', 'show') NOT NULL,
    genre VARCHAR(50) NULL,
    release_date DATE NULL,
    overview TEXT NULL,
    poster_path VARCHAR(255) NOT NULL,
    PRIMARY KEY (media_item_id)
);

-- Create Movies table
CREATE TABLE Movies (
    movie_id INT AUTO_INCREMENT,
    media_item_id INT NOT NULL,
    director VARCHAR(255) NULL,
    runtime_minutes INT NOT NULL,
    PRIMARY KEY (movie_id),
    FOREIGN KEY (media_item_id) REFERENCES Media_items (media_item_id) ON DELETE CASCADE
);

-- Create Shows table
CREATE TABLE Shows (
    show_id INT AUTO_INCREMENT,
    media_item_id INT NOT NULL,
    creator VARCHAR(255) NULL,
    num_of_seasons INT NOT NULL,
    PRIMARY KEY (show_id),
    FOREIGN KEY (media_item_id) REFERENCES Media_items (media_item_id) ON DELETE CASCADE
);

-- Create Watchlist items table
CREATE TABLE Watchlist_items (
    watchlist_item_id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    movie_id INT NULL,
    show_id INT NULL,
    is_watched BOOLEAN DEFAULT FALSE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (watchlist_item_id),
    FOREIGN KEY (user_id) REFERENCES Users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES Movies (movie_id) ON DELETE CASCADE,
    FOREIGN KEY (show_id) REFERENCES Shows (show_id) ON DELETE CASCADE
);
