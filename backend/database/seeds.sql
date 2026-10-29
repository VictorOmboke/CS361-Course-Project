-- Sample data for user table
INSERT INTO
    Users (first_name, last_name, email, password)
VALUES
    ('Jane', 'Doe', 'jdoe@gmail.com', 'password hash'),
    (
        'John',
        'Smith',
        'johnsmith@gmail.com',
        'password hash'
    );

-- Sample data from media items table
INSERT INTO
    Media_items (
        tmdb_id,
        title,
        type,
        genre,
        release_date,
        overview,
        poster_path
    )
VALUES
    (
        10,
        'Star Wars',
        'movie',
        'Adventure',
        '1977-05-25',
        'Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire. Venturesome Luke Skywalker and dashing captain Han Solo team together with the loveable robot duo R2-D2 and C-3PO to rescue the beautiful princess and restore peace and justice in the Empire.',
        '/pWVLFh4OuejTpUaDQbB1C4zoS2p.jpg'
    ),
    (
        1399,
        'Game of Thrones',
        'show',
        'Sci-Fi & Fantasy',
        '2011-04-17',
        'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night''s Watch, is all that stands between the realms of men and icy horrors beyond.',
        '/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg'
    );

-- Sample data for movies table
INSERT INTO
    Movies (media_item_id, director, runtime_minutes)
VALUES
    (1, 'George Lucas', 121);

-- Sample data for shows table 
INSERT INTO
    Shows (media_item_id, creator, num_of_seasons)
VALUES
    (2, 'David Benioff, D.B. Weiss', 8);

-- Sample Data For Watchlist_items
INSERT INTO
    Watchlist_items (user_id, movie_id, show_id, is_watched)
VALUES
    (1, 1, NULL, TRUE),
    (1, NULL, 1, FALSE),
    (2, NULL, 1, TRUE),
    (2, 1, NULL, FALSE);