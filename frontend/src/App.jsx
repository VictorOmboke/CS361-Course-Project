import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import Search from "./pages/Search.jsx";
import Rando from "./pages/Rando.jsx";

function App() {
  return (
    <BrowserRouter>
      {/* Navigation */}
      <nav>
        <Link to={"/"}>Login</Link>
        <Link to={"/register"}>Register</Link>
        <Link to={"/watchlist"}>Watchlist</Link>
        <Link to={"/search"}>Search</Link>
        <Link to={"/rando"}>Rando</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/search" element={<Search />} />
        <Route path="/rando" element={<Rando />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
