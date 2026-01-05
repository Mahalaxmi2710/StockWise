import { useEffect, useState, useMemo } from "react";
import { getHouseholdActivity } from "../api/activity";
import { useAuth } from "../context/AuthContext";

const ACTION_ICONS = {
  ITEM_ADDED: "➕",
  ITEM_UPDATED: "✏️",
  ITEM_CONSUMED: "🍽️",
  ITEM_DELETED: "🗑️",
  ITEM_EXPIRED: "⏰",
  USER_JOINED: "👤",
  USER_LOGIN: "🔐",
  USER_SIGNUP: "📝",
  ALERT_TRIGGERED: "⚠️",
  ALERT_ACKNOWLEDGED: "✅",
  HOUSEHOLD_CREATED: "🏠",
};

const ITEMS_PER_PAGE = 8;

export default function ActivityLog() {
  const { user } = useAuth();
  const householdId = localStorage.getItem("activeHousehold");

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [entityFilter, setEntityFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [userFilter, setUserFilter] = useState("ALL");

  // Pagination
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!householdId) return;

    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await getHouseholdActivity(householdId);
        setLogs(res.data.logs || []);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [householdId]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [entityFilter, actionFilter, userFilter]);

  const users = useMemo(() => {
    const map = new Map();
    logs.forEach((l) => {
      if (l.userId?._id) {
        map.set(l.userId._id, l.userId.name);
      }
    });
    return Array.from(map.entries());
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (entityFilter !== "ALL" && l.entityType !== entityFilter) return false;
      if (actionFilter !== "ALL" && l.action !== actionFilter) return false;
      if (userFilter !== "ALL" && l.userId?._id !== userFilter) return false;
      return true;
    });
  }, [logs, entityFilter, actionFilter, userFilter]);

  // Pagination slice
  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLogs, page]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);

  // Grouping (unchanged)
  const groupByDate = (logs) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    return logs.reduce(
      (acc, log) => {
        const logDate = new Date(log.createdAt).toDateString();
        if (logDate === today) acc.Today.push(log);
        else if (logDate === yesterday) acc.Yesterday.push(log);
        else acc.Earlier.push(log);
        return acc;
      },
      { Today: [], Yesterday: [], Earlier: [] }
    );
  };

  const grouped = groupByDate(paginatedLogs);

  // Relative time (NEW)
  const formatTime = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 120) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    return new Date(date).toLocaleTimeString();
  };

  if (!householdId) return <p className="empty-text">No household selected</p>;
  if (loading) return <p className="loading-text">Loading activity…</p>;

  return (
    <div className="activity-page">
      <div className="activity-container">
        <div className="activity-header">
          <h2>Activity Log</h2>
          <p className="subtitle">Recent actions in this household</p>
        </div>

        <div className="activity-filters">
          <select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)}>
            <option value="ALL">All Entities</option>
            <option value="INVENTORY">Inventory</option>
            <option value="ALERT">Alert</option>
            <option value="HOUSEHOLD">Household</option>
            <option value="USER">User</option>
          </select>

          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
            <option value="ALL">All Actions</option>
            {[...new Set(logs.map((l) => l.action))].map((a) => (
              <option key={a} value={a}>
                {a.replaceAll("_", " ")}
              </option>
            ))}
          </select>

          <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
            <option value="ALL">All Users</option>
            {users.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {filteredLogs.length === 0 && (
          <p className="empty-text">No activity found</p>
        )}

        {Object.entries(grouped).map(
          ([section, items]) =>
            items.length > 0 && (
              <div key={section} className="activity-section">
                <h4>{section}</h4>

                {items.map((log) => (
                  <div key={log._id} className="activity-item">
                    <div className="activity-icon">
                      {ACTION_ICONS[log.action] || "•"}
                    </div>

                    <div className="activity-content">
                      <p className="message">{log.message}</p>
                      <span className="meta">
                        {log.userId?.name || "System"} · {formatTime(log.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="activity-pagination">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              Prev
            </button>
            <span>{page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
