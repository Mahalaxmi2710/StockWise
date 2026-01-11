import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Bell,
  Activity,
  Users
} from "lucide-react";

export default function Sidebar() {
  const { pathname } = useLocation();

  const isActive = path => pathname.startsWith(path);

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <Link
          to="/dashboard"
          className={isActive("/dashboard") ? "active" : ""}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/inventory"
          className={isActive("/inventory") ? "active" : ""}
        >
          <Package size={18} />
          <span>Inventory</span>
        </Link>

        <Link
          to="/alerts"
          className={isActive("/alerts") ? "active" : ""}
        >
          <Bell size={18} />
          <span>Alerts</span>
        </Link>

        <Link
          to="/activity"
          className={isActive("/activity") ? "active" : ""}
        >
          <Activity size={18} />
          <span>Activity</span>
        </Link>

        <Link
          to="/households"
          className={isActive("/households") ? "active" : ""}
        >
          <Users size={18} />
          <span>Households</span>
        </Link>
      </nav>
    </aside>
  );
}
