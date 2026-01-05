import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function HouseholdSelector() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const households = user.households || [];

  const selectHousehold = (id) => {
    localStorage.setItem("activeHousehold", id);
    navigate("/dashboard");
  };

  return (
    <div className="hs-container">
      <nav className="hs-navbar">
        <h2 className="hs-logo">StockWise</h2>
      </nav>

      <div className="hs-content">
        <h1>Select Your Household</h1>
        <p>Choose a household to manage inventory and track items</p>

        <div className="hs-grid">
          {households.map((h) => (
            <div
              key={h.householdId._id}
              className="hs-card"
              onClick={() => selectHousehold(h.householdId._id)}
            >
              <h3>{h.householdId.name}</h3>
              <span className="hs-role">{h.role}</span>
            </div>
          ))}

          {/* Create / Join */}
          <div
            className="hs-card hs-add"
            onClick={() => navigate("/onboarding")}
          >
            <h3>+ Create or Join</h3>
            <p>Start a new household or join an existing one</p>
          </div>
        </div>
      </div>
    </div>
  );
}
