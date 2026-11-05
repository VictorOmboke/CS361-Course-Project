import pool from "../database/db-connect";

const WatchlistModel = {
  // Find media item by tmdb ID
  async findByTmdbId(tmdb_id) {
    const query = `
            SELECT media_item_id 
            FROM Media_items
            WHERE tmdb_id = ?;
        `;
    const [rows] = await pool.execute(query, [tmdb_id]);

    // Return media item id
    return rows[0];
  },

  // Add media item
  async addMediaItem(
    tmdb_id,
    title,
    type,
    genre,
    release_date,
    overview,
    poster_path
  ) {
    const query = `
            INSERT INTO Media_items (tmdb_id, title, type, genre, release_date, overview, poster_path)
            VALUES
            (?, ?, ?, ?, ?, ?, ?);
        `;
    const [result] = await pool.execute(query, [
      tmdb_id,
      title,
      type,
      genre,
      release_date,
      overview,
      poster_path,
    ]);

    // Return media item ID
    return result.insertId;
  },

  // Add movie
  async addMovie(media_item_id, director, runtime_in_minutes) {
    const query = `
        INSERT INTO Movies (media_item_id, director, runtime_in_minutes)
        VALUES
        (?, ?, ?);
    `;
    const [result] = await pool.execute(query, [
      media_item_id,
      director,
      runtime_in_minutes,
    ]);

    // Return movie ID
    return result.insertId;
  },

  // Add show
  async addShow(media_item_id, creator, num_of_seasons) {
    const query = `
        INSERT INTO Shows (media_item_id, creator, num_of_seasons)
        VALUES
        (?, ?, ?);
    `;
    const [result] = await pool.execute(query, [
      media_item_id,
      creator,
      num_of_seasons,
    ]);

    // Return show ID
    return result.insertId;
  },

  // Add to watchlist
  async addWatchlistItem(user_id, media_item_id, is_watched) {
    const query = `
        INSERT INTO Watchlist_items (user_id, media_item_id, is_watched)
        VALUES
        (?, ?, ?);
    `;
    const [result] = await pool.execute(query, [
      user_id,
      media_item_id,
      is_watched,
    ]);

    // Return watchlist item ID
    return result.insertId;
  },

  // Get a user's watchlist items for the watchlist dashboard
  async getWatchlistByUserId(user_id) {
    const query = `
        SELECT 
            wi.watchlist_item_id, 
            mi.tmdb_id, 
            mi.poster_path, 
            mi.title, 
            mi.release_date, 
            m.runtime_minutes, 
            s.num_of_seasons 
        FROM Watchlist_items AS wi
        LEFT JOIN Media_items AS mi 
            ON wi.media_item_id = mi.media_item_id
        LEFT JOIN Movies AS m 
            ON wi.media_item_id = m.media_item_id
        LEFT JOIN Shows AS s 
            ON wi.media_item_id = s.media_item_id
        WHERE wi.user_id = ?;
    `;
    const [rows] = await pool.execute(query, [user_id]);

    // Return the Rows of data
    return rows;
  },

  // Get watchlist item details for a movie or show
  async getWatchlistItemDetails(media_item_id) {
    const query = `
        SELECT
            mi.media_item_id,
            mi.tmdb_id,
            mi.poster_path,
            mi.title, 
            mi.release_date,
            mi.type,
            mi.genre,
            mi.overview,
            m.director,
            m.runtime_minutes,
            s.creator,
            s.num_of_seasons
        FROM Media_items AS mi
        LEFT JOIN Movies AS m
            ON mi.media_item_id = m.media_item_id
        LEFT JOIN Shows AS s
            ON mi.media_item_id = s.media_item_id
        WHERE mi.media_item_id = ?;
    `;
    const [rows] = await pool.execute(query, [media_item_id]);

    // Return the rows of data
    return rows[0];
  },

  // Find a watchlist item in a user's watchlist
  async findWatchlistItemById(user_id, tmdb_id) {
    const query = `
        SELECT wi.watchlist_item_id
        FROM Watchlist_items AS wi
        JOIN Media_items AS mi
            ON wi.media_item_id = mi.media_item_id
        WHERE wi.user_id = ? AND mi.tmdb_id = ?;
    `;
    const [rows] = await pool.execute(query, [user_id, tmdb_id]);

    // Return watchlist item ID
    return rows[0];
  },

  // Update a watchlist item to watched or unwatched
  async updateIsWatched(watchlist_item_id, watch_state) {
    const query = `
        UPDATE Watchlist_items
        SET is_watched = ?
        WHERE watchlist_item_id = ?;
    `;
    const [result] = await pool.execute(query, [
      watch_state,
      watchlist_item_id,
    ]);

    // Return number of affected rows
    return result.affectedRows;
  },

  // Delete a media item from a user's watchlist
  async deleteWatchlistItem(watchlist_item_id) {
    const query = `
        DELETE FROM Watchlist_items
        WHERE watchlist_item_id = ?;
    `;
    const [result] = await pool.execute(query, [watchlist_item_id]);

    // Return number of rows affected
    return result.affectedRows;
  },
};

export default WatchlistModel;
