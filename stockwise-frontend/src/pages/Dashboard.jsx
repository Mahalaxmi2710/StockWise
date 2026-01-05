import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const activeHousehold = localStorage.getItem("activeHousehold");

  if (!activeHousehold) {
    return <Navigate to="/households" replace />;
  }

  return (
    <div className="page">
      <h2>Dashboard</h2>

      <div className="card">Inventory Overview</div>
      <div className="card">Expiry Alerts</div>
      <div className="card">Recent Activity</div>
    </div>
  );
}
