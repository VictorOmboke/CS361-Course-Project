import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";

export default function Rando() {
  const [watchlist, setWatchlist] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [titleDetails, setTitleDetails] = useState(null);
  const [error, setError] = useState("");

  // Get the user's watchlist
  useEffect(() => {
    const getWatchlist = async () => {
      try {
        // Get user credentials
        const accessToken = localStorage.getItem("token");

        // Call backend api
        const response = await fetch("/api/watchlist/", {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        // Parse data
        const data = await response.json();

        // Check if response is valid
        if (!response.ok) {
          throw new Error(data.message || "Failed to load watchlist");
        }

        // Store watchlist
        setWatchlist(data.watchlist);
      } catch (err) {
        setError(err.message);
      }
    };

    getWatchlist();
  }, []);

  // Select random item from user's watchlist
  const handleRando = async () => {
    try {
      // Handle empty watchlist
      if (watchlist.length === 0) return;

      // Generate a random index
      const randomIndex = Math.floor(Math.random() * watchlist.length);

      // Select random title from watchlist
      const chosenItem = watchlist[randomIndex];

      // Get user credentials
      const accessToken = localStorage.getItem("token");

      // Get full details for selected title
      const response = await fetch(
        `/api/watchlist/media_item/${chosenItem.media_item_id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // Parse data
      const data = await response.json();

      // Check if response is valid
      if (!response.ok) {
        throw new Error(data.message || "Failed to load title details");
      }

      // Store data
      setTitleDetails(data.watchlist_item_details);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="rando-container">
      <Navbar />

      <h1>RANDO</h1>

      <button
        className="rando-btn"
        onClick={() => handleRando()}
        disabled={watchlist.length === 0}
      >
        SURPRISE ME
      </button>

      <div className="rando-result-container">
        {watchlist.length === 0 ? (
          <div className="rando-empty-msg">
            <p>Your watchlist is empty</p>
            <p>Go add some titles and come back to use Rando</p>
          </div>
        ) : null}

        {titleDetails && (
          <div className="rando-result-card">
            <div className="rando-result-img">
              {titleDetails.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${titleDetails.poster_path}`}
                  alt={titleDetails.title}
                />
              )}
            </div>
            <div className="rando-result-details">
              <div className="rando-result-title-year">
                <span className="rando-result-title">{titleDetails.title}</span>

                <span className="rando-result-year">
                  {` (${titleDetails.release_date?.slice(0, 4)})`}
                </span>
              </div>

              <p className="rando-result-creator">
                {titleDetails.director || titleDetails.creator}
              </p>

              <p className="rando-result-runtime">
                {titleDetails.runtime_minutes
                  ? `${titleDetails.runtime_minutes}m`
                  : `${titleDetails.num_of_seasons} Seasons`}
              </p>

              <p className="rando-result-header">Overview</p>
              <p className="rando-result-overview">{titleDetails.overview}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
