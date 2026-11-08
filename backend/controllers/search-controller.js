const SearchController = {
  // Search TMDB API for movies and shows
  async searchTmdb(req, res, next) {
    try {
      // Get user's search query
      const { query } = req.query;

      // Check if the query is valid
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      // Send request to TMDB API
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
            accept: "application/json",
          },
        }
      );

      // Parse Search Data
      const data = await response.json();

      // Return search results
      res.status(200).json(data.results);
    } catch (error) {
      next(error);
    }
  },
};

export default SearchController;
