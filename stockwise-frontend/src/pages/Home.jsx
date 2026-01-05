import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-container">
      <nav className="home-navbar">
        <h2 className="logo">StockWise</h2>
      </nav>

      <main className="home-hero">
        <h1>
          Smart Household <span>Inventory Management</span>
        </h1>

        <p>
          Track groceries, monitor expiry dates, and manage your household
          inventory effortlessly.
        </p>

        <div className="home-actions">
          <Link to="/login">
            <button className="btn primary">Login</button>
          </Link>

          <Link to="/signup">
            <button className="btn secondary">Create Account</button>
          </Link>
        </div>
      </main>
    </div>
  );
}
