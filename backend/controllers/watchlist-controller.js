import AppError from "../utils/app-error.js";
import WatchlistModel from "../models/watchlist-model.js";

const WatchlistController = {
  // Add watchlist item
  async addToWatchlist(req, res, next) {
    // Get user and media item information
    const { user_id } = req.user;
    const { tmdb_id, type } = req.body;
    console.log(`User ID: ${user_id}, TMDB ID: ${tmdb_id}, Type: ${type}`);

    // Check if the watchlist already item exists in watchlist
    const watchlistItem = await WatchlistModel.findWatchlistItemById(
      user_id,
      tmdb_id
    );

    if (watchlistItem) {
      throw new AppError("This is already in your watchlist!", 400);
    }

    // Check if the media item exists in database
    const mediaItemId = await WatchlistModel.findMediaItemByTmdbId(tmdb_id);

    if (!mediaItemId) {
      // Handle if the watchlist item is a movie or show
      if (type === "movie") {
        // Send request to API for movie details
        const movieUrl = `https://api.themoviedb.org/3/movie/${tmdb_id}?append_to_response=credits`;
        const movieResponse = await fetch(movieUrl, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
          },
        });

        // Validate API response
        if (!movieResponse.ok) {
          throw new AppError("TMDB API request error", movieResponse.status);
        }

        // Parse data from API request
        const movieData = await movieResponse.json();

        // Store necessary Data
        const { id, title, poster_path, release_date, overview, runtime } =
          movieData;

        // Get genre
        const genre = movieData.genres?.[0]?.name || null;

        // Get director's name
        const directorObj = movieData.credits.crew.find(
          (c) => c.job === "Director"
        );
        const directorName = directorObj ? directorObj.name : null;

        // Store movie data in database
        const newMovieMediaItemId = await WatchlistModel.addMediaItem(
          id,
          title,
          type,
          genre,
          release_date,
          overview,
          poster_path
        );

        console.log("New movie media item ID:", newMovieMediaItemId);

        // Add movie specific details to movie table
        await WatchlistModel.addMovie(
          newMovieMediaItemId,
          directorName,
          runtime
        );

        console.log("Adding movie with values:", {
          id,
          title,
          type,
          genre,
          release_date,
          overview,
          poster_path,
          directorName,
          runtime,
        });

        // Add movie to user's watchlist
        const newMovieWatchlistItemId = await WatchlistModel.addWatchlistItem(
          user_id,
          newMovieMediaItemId
        );

        // Send success message
        res.status(201).json({
          message: "Movie added successfully",
          watchlist_id: newMovieWatchlistItemId,
        });
      } else {
        // Send request to API for show details
        const showUrl = `https://api.themoviedb.org/3/tv/${tmdb_id}`;
        const showResponse = await fetch(showUrl, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
          },
        });

        // validate API response
        if (!showResponse.ok) {
          throw new AppError("TMBD API request error", showResponse.status);
        }

        // Parse show data
        const showData = await showResponse.json();

        // Store necessary data
        const {
          id,
          name,
          poster_path,
          first_air_date,
          overview,
          number_of_seasons,
        } = showData;

        // Get genre
        const genre = showData.genres?.[0]?.name || null;

        // Get show creators
        const creatorObj = showData.created_by;
        const creatorNamesString = creatorObj
          ? creatorObj.map((creator) => creator.name).join(", ")
          : null;

        console.log("Adding show with values:", {
          id,
          name,
          type,
          genre,
          first_air_date,
          overview,
          poster_path,
          creatorNamesString,
          number_of_seasons,
        });

        // Store show data in database
        const newShowMediaItemId = await WatchlistModel.addMediaItem(
          id,
          name,
          type,
          genre,
          first_air_date,
          overview,
          poster_path
        );

        // Store show specific data in show table
        await WatchlistModel.addShow(
          newShowMediaItemId,
          creatorNamesString,
          number_of_seasons
        );

        // Add show to user's watchlist
        const newShowWatchlistItemId = await WatchlistModel.addWatchlistItem(
          user_id,
          newShowMediaItemId
        );

        // Send success message
        res.status(201).json({
          message: "Show added successfully",
          watchlist_item_id: newShowWatchlistItemId,
        });
      }
    } else {
      // Media item exists in the database so add item to user watchlist
      const newWatchlistItemId = await WatchlistModel.addWatchlistItem(
        user_id,
        mediaItemId
      );

      // Send success message
      res.status(201).json({
        message: "Added successfully",
        watchlist_item_id: newWatchlistItemId,
      });
    }
  },

  // Get watchlist items for a user's dashboard
  async getWatchlist(req, res, next) {
    // Get user information
    const { user_id } = req.user;

    // Check if user exists
    if (!user_id) {
      throw new AppError("User not found", 404);
    }

    // Get user's watchlist items
    const watchlist = await WatchlistModel.getWatchlistByUserId(user_id);

    // Send success message
    res.status(200).json({
      message: "Watchlist returned successfully",
      watchlist: watchlist,
    });
  },

  // Get watchlist item details
  async getWatchlistItemDetails(req, res, next) {
    // Get media item information
    const { id } = req.params;

    // Check if the media item exists
    if (!id) {
      throw new AppError("Item not found", 404);
    }

    // Get the watchlist item's details
    const watchlistItemDetails = await WatchlistModel.getWatchlistItemDetails(
      id
    );

    // Send success message
    res.status(200).json({
      message: "Item details returned successfully",
      watchlist_item_details: watchlistItemDetails,
    });
  },

  // Update watch state for the watchlist items
  async updateWatchState(req, res, next) {
    // Watchlist item details
    const { id } = req.params;
    const { newWatchState } = req.body;

    // Check if the watchlist item exists
    if (!id) {
      throw new AppError("Item not found", 404);
    }

    // Update the watchlist item's watched state
    await WatchlistModel.updateIsWatched(id, newWatchState);

    // Send success message
    res.status(200).json({
      message: "Watch state updated successfully",
      new_watch_state: newWatchState,
    });
  },

  // Delete a watchlist item
  async deleteWatchlistItem(req, res, next) {
    // Get watchlist item information
    const { id } = req.params;

    // Check if watchlist item exists
    if (!id) {
      throw new AppError("Item not found", 404);
    }

    //Delete watchlist item
    await WatchlistModel.deleteWatchlistItem(id);

    // Return success message
    res.status(200).json({
      message: "Item deleted successfully",
      watchlist_item_id: id,
    });
  },
};

export default WatchlistController;
