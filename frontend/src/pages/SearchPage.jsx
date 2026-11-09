import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { Plus, Search } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  // Search item based on user's query
  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Get user's credentials
      const accessToken = localStorage.getItem("token");

      // Call backend api
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // Parse data
      const data = await response.json();

      // Check if response is valid
      if (!response.ok) {
        throw new Error(data.message || "Search failed");
      }

      // Convert media type to match backend structure
      const formattedData = data.map((item) => ({
        ...item,
        media_type: item.media_type === "tv" ? "show" : item.media_type,
      }));

      // Store results
      setResults(formattedData);
    } catch (err) {
      setError(err.message);
    }
  };

  // Add search result to watchlist
  const handleAddToWatchlist = async (tmdbId, mediaType) => {
    try {
      // Get user credentials
      const accessToken = localStorage.getItem("token");

      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ tmdb_id: tmdbId, type: mediaType }),
      });

      // Parse data
      const data = await response.json();

      // Check if response is valid
      if (!response.ok) {
        throw new Error(data.message || "Failed to add title");
      }

      alert("Successfully added to watchlist!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="search-container">
      <Navbar />

      <h1>SEARCH</h1>

      <div className="search-form">
        <form onSubmit={handleSearch}>
          <input type="text" onChange={(e) => setQuery(e.target.value)} />
          <button type="submit">
            <Search />
          </button>
        </form>
      </div>

      <div className="search-results-container">
        {results.length === 0 ? (
          <div className="empty-results-msg">
            <p>Search for your next title!</p>
          </div>
        ) : (
          results.map((item) => (
            <div key={item.id} className="result-card">
              {item.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.name}
                />
              )}
              <p className="result-title">{item.name || item.title}</p>
              <span className="result-year">{`(${(
                item.first_air_date || item.release_date
              )?.slice(0, 4)})`}</span>
              <p>Overview</p>
              <p className="result-overview">{item.overview}</p>
              <button
                className="result-add-btn"
                onClick={() => handleAddToWatchlist(item.id, item.media_type)}
              >
                <Plus />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
