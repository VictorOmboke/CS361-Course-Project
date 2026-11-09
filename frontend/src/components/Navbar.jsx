import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate(); // Navigate users to other pages

  // Handle logout functionality
  const handleLogout = () => {
    // Remove access token
    localStorage.removeItem("token");

    // Take user's back to login page
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="brand">
        <h2>Screeni</h2>
      </div>

      <div className="nav-links">
        <Link to={"/watchlist"}>Watchlist</Link>
        <Link to={"/search"}>Search</Link>
        <Link to={"/rando"}>Rando</Link>
        <Link to={"/profile"}>Profile</Link>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut />
        </button>
      </div>
    </nav>
  );
}
