import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage.jsx";
import Register from "./pages/RegisterPage.jsx";
import Watchlist from "./pages/WatchlistPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import Rando from "./pages/RandoPage.jsx";

function App() {
  return (
    <BrowserRouter>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/rando" element={<Rando />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
