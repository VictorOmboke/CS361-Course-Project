import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Router hook to navigate users programmatically
  const navigate = useNavigate();

  // Handle register form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call Register route from backend api
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      // store response
      const data = await response.json();

      // Check if response is valid
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Set JWT token to browser storage
      localStorage.setItem("token", data.accessToken);

      // Redirect user's to their watchlist
      navigate("/watchlist");
    } catch (err) {
      setError(err.message);
    }
  };

  // Redirect user back to login page
  const handleExistingUser = () => {
    // Redirect user
    navigate("/");
  };

  return (
    <div className="register-container">
      <h1>SCREENi</h1>
      <h3>The App Created To Tackle Your Backlog</h3>

      <div className="register-form-container">
        <h3>Sign Up</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Register</button>
        </form>
      </div>

      <div className="login">
        <p>Already have an account?</p>
        <button onClick={handleExistingUser}>Login</button>
      </div>
    </div>
  );
}
