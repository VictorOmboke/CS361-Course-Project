import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { Plus, X, Trash } from "lucide-react";

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [sortOrder, setSortOrder] = useState("oldest");
  const [deleteMsg, setDeleteMsg] = useState("");
  const [error, setError] = useState("");

  // Router hook to navigate users programmatically
  const navigate = useNavigate();

  // get data from backend
  useEffect(() => {
    const getData = async () => {
      try {
        // Get auth token from local storage
        const accessToken = localStorage.getItem("token");

        // Handle user access
        if (!accessToken) {
          // Send user's back to login if they don't have access.
          navigate("/");
          return; // Exit function
        }

        // Make call to backend api
        const response = await fetch("/api/watchlist/", {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        // Parse response data
        const data = await response.json();

        // Check if response is valid
        if (!response.ok) {
          throw new Error(data.message || "Unable to get watchlist items");
        }

        // Store response
        setWatchlist(data.watchlist);
      } catch (err) {
        setError(err.message);
      }
    };
    getData();
  }, []);

  // Launch title details modal
  const handleCardClick = async (mediaItemId) => {
    try {
      const accessToken = localStorage.getItem("token");

      // Make call to backend api
      const response = await fetch(`/api/watchlist/media_item/${mediaItemId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Parse  response data
      const data = await response.json();

      // Check if response is valid
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch title details");
      }

      // Store title details
      setSelectedItem(data.watchlist_item_details);
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle deleting a watchlist item
  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const accessToken = localStorage.getItem("token");

      // Make call to backend api
      const response = await fetch(`/api/watchlist/item/${itemToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Parse data
      const data = await response.json();

      // Check if response is valid
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete title");
      }

      // Store response
      setDeleteMsg(data.message);

      // Update watchlist
      setWatchlist(
        watchlist.filter((item) => item.watchlist_item_id !== itemToDelete)
      );

      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      alert(deleteMsg);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle the list sorting functionality
  const handleSortToggle = () => {
    setSortOrder((prevOrder) => (prevOrder === "oldest" ? "newest" : "oldest"));
  };

  // Sort watchlist based on order state
  const sortedWatchlist = [...watchlist].sort((a, b) => {
    if (sortOrder === "oldest") {
      // Sorted From oldest to newest
      return a.watchlist_item_id - b.watchlist_item_id;
    } else {
      // Sorted from newest to oldest
      return b.watchlist_item_id - a.watchlist_item_id;
    }
  });

  return (
    <div className="watchlist-container">
      <Navbar />

      <h1>WATCHLIST</h1>

      <div className="action-btns">
        <button className="sort-btn" onClick={handleSortToggle}>
          {sortOrder === "oldest" ? "Oldest" : "Newest"}
        </button>
        <button className="add-btn" onClick={() => navigate("/search")}>
          <Plus strokeWidth={3} />
        </button>
      </div>

      <div className="watchlist-grid">
        {watchlist.length === 0 ? (
          <>
            <p>Your watchlist is empty!</p>
            <p>Go search up some titles!</p>
          </>
        ) : (
          sortedWatchlist.map((item) => (
            <div
              key={item.watchlist_item_id}
              className="title-card"
              onClick={() => handleCardClick(item.media_item_id)}
            >
              {/* Extract data */}
              {item.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title}
                />
              )}
              <p>{item.title}</p>
              <span>{item.release_date.slice(0, 4)}</span>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setItemToDelete(item.watchlist_item_id);
                  setIsDeleteModalOpen(true);
                }}
              >
                <Trash size={20} strokeWidth={1.5} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Handle delete confirmation modal */}
      {isDeleteModalOpen && (
        <div className="delete-modal-overlay">
          <div className="delete-confirmation-modal modal-content">
            <p className="delete-modal-msg">
              Are you sure you want to delete this from your watchlist?
            </p>
            <p className="delete-modal-msg">You will have to add this back.</p>
            <div className="delete-modal-btns">
              <button
                className="delete-modal-cancel-btn"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setItemToDelete(null);
                }}
              >
                Cancel
              </button>
              <button className="delete-modal-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Handle title modal */}
      {isModalOpen && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close-btn"
              onClick={() => setIsModalOpen(false)}
            >
              <X 
                size={25}
                strokeWidth={2.5}
              />
            </button>
            <div className="img-container">
              {selectedItem.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${selectedItem.poster_path}`}
                  alt={selectedItem.title}
                />
              )}
            </div>
            <div className="details-container">
              <div className="modal-title-year">
                <span className="modal-title">{selectedItem.title}</span>
                <span className="modal-year">
                  {` (${selectedItem.release_date.slice(0, 4)})`}
                </span>
              </div>
              <p className="modal-runtime">
                {selectedItem.runtime_minutes
                  ? `${selectedItem.runtime_minutes}m`
                  : `${selectedItem.num_of_seasons} Seasons`}
              </p>
              <p className="modal-creator">
                {selectedItem.director || selectedItem.creator}
              </p>
              <p className="modal-genre">{selectedItem.genre}</p>
              <h3>Overview</h3>
              <p className="modal-overview">{selectedItem.overview}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
