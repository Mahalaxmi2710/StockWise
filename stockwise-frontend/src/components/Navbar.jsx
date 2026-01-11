import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("activeHousehold");
    navigate("/");
    logout();
  };

  return (
    <header className="navbar">
      {/* LEFT: LOGO */}
      <div
        className="navbar-brand"
        onClick={() => navigate("/dashboard")}
        role="button"
      >
        <div className="brand-icon">📦</div>
        <h3 className="logo-text">StockWise</h3>
      </div>

      {/* DESKTOP ACTIONS */}
      <div className="navbar-actions desktop-only">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* MOBILE MENU ICON */}
      <button
        className="hamburger mobile-only"
        onClick={() => setOpen(!open)}
      >
        <Menu size={22} />
      </button>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="mobile-menu">
          <button onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
          <button className="danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
