import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/inventory">Inventory</Link>
      <Link to="/alerts">Alerts</Link>
      <Link to="/activity">Activity</Link>
      <Link to="/households">Households</Link>
    </div>
  );
}
