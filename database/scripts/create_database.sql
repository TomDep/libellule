CREATE TABLE IF NOT EXISTS album_type (
                                          album_type_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                                          name VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS genre (
                                     genre_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                                     name VARCHAR(500) NOT NULL
);

CREATE TABLE IF NOT EXISTS song_genre (
                                          song_id INTEGER NOT NULL,
                                          genre_id INTEGER NOT NULL,
                                          PRIMARY KEY (song_id, genre_id)
);

CREATE TABLE IF NOT EXISTS album (
                                     album_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                                     album_type_id INTEGER,
                                     name VARCHAR(500) NOT NULL,
                                     artist_id INTEGER,
                                     FOREIGN KEY (album_type_id) REFERENCES album_type (album_type_id),
                                     FOREIGN KEY (artist_id) REFERENCES artist (artist_id)
);

CREATE TABLE IF NOT EXISTS song (
                                    song_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                                    title TEXT NOT NULL,
                                    album_id INTEGER,
                                    FOREIGN KEY (album_id) REFERENCES album (album_id)
);

CREATE TABLE IF NOT EXISTS song_artist (
                                           song_id INTEGER NOT NULL,
                                           artist_id INTEGER NOT NULL,
                                           PRIMARY KEY (song_id, artist_id),
                                           FOREIGN KEY (artist_id) REFERENCES artist (artist_id),
                                           FOREIGN KEY (song_id) REFERENCES song (song_id)
);

CREATE TABLE IF NOT EXISTS artist (
                                      artist_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                                      name VARCHAR(500) NOT NULL
);