import { useEffect, useState, useMemo } from "react";
import { getAlerts, acknowledgeAlert } from "../api/alerts";

const SEVERITY_COLORS = {
  LOW: "alert-low",
  MEDIUM: "alert-medium",
  HIGH: "alert-high",
  CRITICAL: "alert-critical",
};

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} day(s) ago`;
}

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Phase 2 filters (kept)
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [ackFilter, setAckFilter] = useState("ALL");

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await getAlerts();
      setAlerts(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAcknowledge = async (alertId) => {
    try {
      await acknowledgeAlert(alertId);
      fetchAlerts();
    } catch {
      console.error("Failed to acknowledge alert");
    }
  };

  // Phase 3-aware filtering
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const acknowledgedByMe = alert.acknowledgedByMe === true;

      // Severity filter
      if (severityFilter !== "ALL" && alert.severity !== severityFilter)
        return false;

      // Ack filter (PHASE 3 FIX)
      if (ackFilter === "ACK" && !acknowledgedByMe) return false;
      if (ackFilter === "UNACK" && acknowledgedByMe) return false;

      return true;
    });
  }, [alerts, severityFilter, ackFilter]);

  if (loading) return <p className="loading-text">Loading alerts…</p>;
  if (filteredAlerts.length === 0)
    return <p className="empty-text">No alerts 🎉</p>;

  return (
    <div className="alerts-page">
      <div className="alerts-header">
        <h2>Alerts</h2>
        <p className="subtitle">Items that need your attention</p>
      </div>

      {/* Phase 2 Filters (UNCHANGED UI) */}
      <div className="alerts-filters">
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
        >
          <option value="ALL">All Severities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

        <select
          value={ackFilter}
          onChange={(e) => setAckFilter(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="UNACK">Unacknowledged</option>
          <option value="ACK">Acknowledged</option>
        </select>
      </div>

      <div className="alerts-list">
        {filteredAlerts.map((alert) => (
          <div
            key={alert._id}
            className={`alert-item ${
              SEVERITY_COLORS[alert.severity]
            } ${alert.acknowledgedByMe ? "acknowledged" : ""}`}
          >
            <div className="alert-main">
              <p className="alert-message">{alert.message}</p>

              {alert.inventoryItemId && (
                <p className="alert-item-name">
                  Item: {alert.inventoryItemId.name}
                </p>
              )}

              <span className="alert-meta">
                {alert.severity} · {timeAgo(alert.createdAt)}
              </span>
            </div>

            {!alert.acknowledgedByMe ? (
              <button
                className="ack-btn"
                onClick={() => handleAcknowledge(alert._id)}
              >
                Acknowledge
              </button>
            ) : (
              <span className="ack-text">Acknowledged by you</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
