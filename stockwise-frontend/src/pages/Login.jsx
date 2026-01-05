import { useState } from "react";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginApi({ email, password });
      await login(res.data.token);
      navigate("/households");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="home-container">
      <nav className="home-navbar">
        <h2 className="logo">StockWise</h2>
      </nav>

      <main className="auth-card-wrapper">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Login to your account</p>

          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="btn primary full">Login</button>
          </form>

          <p className="auth-footer">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
