import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";
import { Package, Clock, ShieldAlert, BarChart3, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} day(s) ago`;
}

function formatDate(date) {
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}


function TrendsLineChart({ data }) {
  if (!data || data.length < 2) {
    return <p className="muted-text">Not enough data to show trend</p>;
  }

  const width = 320;
  const height = 160;
  const padding = 36;

  const values = data.map(d => d.count);
  const maxValue = Math.max(...values, 1);

  const points = data.map((d, i) => {
    const x =
      padding +
      (i / (data.length - 1)) * (width - padding * 2);

    const y =
      height -
      padding -
      (d.count / maxValue) * (height - padding * 2);

    return { x, y, value: d.count, label: d.date ? formatDate(d.date) : `T${i + 1}`};
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="trend-chart"
    >
      {/* GRID LINES */}
      {[0.25, 0.5, 0.75].map((g, i) => (
        <line
          key={i}
          x1={padding}
          y1={height - padding - g * (height - padding * 2)}
          x2={width - padding}
          y2={height - padding - g * (height - padding * 2)}
          className="trend-grid"
        />
      ))}

      {/* AXES */}
      <line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height - padding}
        className="trend-axis"
      />
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        className="trend-axis"
      />

      {/* LINE */}
      <polyline
        fill="none"
        strokeWidth="2"
        points={points.map(p => `${p.x},${p.y}`).join(" ")}
        className="trend-line"
      />

      {/* POINTS + VALUE LABELS */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" className="trend-point" />
          <text
            x={p.x}
            y={p.y - 8}
            textAnchor="middle"
            className="trend-value"
          >
            {p.value}
          </text>

          {/* X-AXIS LABEL */}
          <text
            x={p.x}
            y={height - padding + 14}
            textAnchor="middle"
            className="trend-x-label"
          >
            {p.label}
          </text>
        </g>
      ))}

      {/* Y-AXIS LABEL */}
      <text
        x="12"
        y={padding - 6}
        className="trend-y-label"
      >
        Count
      </text>
    </svg>
  );
}



export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const activeHousehold = localStorage.getItem("activeHousehold");

  const [inviteCode, setInviteCode] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);

  const [unackAlerts, setUnackAlerts] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);

  /* ===== NEW STATE ===== */
  const [analytics, setAnalytics] = useState(null);

  if (!activeHousehold) {
    return <Navigate to="/households" replace />;
  }

  /* Fetch invite code */
  useEffect(() => {
    axios.get(`/households/${activeHousehold}`).then(res => {
      setInviteCode(res.data.inviteCode);
    });
  }, [activeHousehold]);

  /* Fetch alerts count */
  useEffect(() => {
    axios.get("/alerts").then(res => {
      const count = res.data.filter(a => !a.acknowledgedByMe).length;
      setUnackAlerts(count);
    });
  }, []);

  /* Fetch recent activity (limit 3) */
  useEffect(() => {
    axios
      .get(`/activity/${activeHousehold}?limit=3`)
      .then(res => setRecentActivity(res.data.logs || []));
  }, [activeHousehold]);

  /* ===== FETCH DASHBOARD ANALYTICS ===== */
  useEffect(() => {
    axios
      .get(`/dashboard/analytics/${activeHousehold}`)
      .then(res => setAnalytics(res.data))
      .catch(() => setAnalytics(null));
  }, [activeHousehold]);

  const copyInvite = async () => {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="dashboard-page">
      <h2>Dashboard</h2>

      {/* INVITE TILE (TOP) */}
      <div className="invite-tile glow-card">
        <div>
          <h3>Household Invite</h3>
          <p>Invite members to your household using a secure code</p>
        </div>
        <button onClick={() => setShowInvite(true)}>Share Invite</button>
      </div>

      {/* MAIN GRID */}
      <div className="dashboard-grid">
        {/* Inventory Overview */}
        <div className="dashboard-card glow-card">
          <h3>Inventory Overview</h3>
          <ul className="overview-list">
            <li><Package size={16} /> Manage your household inventory</li>
            <li><Clock size={16} /> Track quantities and expiry dates</li>
            <li><ShieldAlert size={16} /> Reduce waste with smart alerts</li>
          </ul>
        </div>

        {/* Alerts */}
        <div
          className="dashboard-card glow-card clickable"
          onClick={() => navigate("/alerts")}
        >
          <h3>Expiry Alerts</h3>
          <p>
            {unackAlerts > 0
              ? `${unackAlerts} unacknowledged alert(s)`
              : "No pending alerts 🎉"}
          </p>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card glow-card wide-card">
          <h3>Recent Activity</h3>

          {recentActivity.length === 0 ? (
            <p className="muted-text">No recent activity</p>
          ) : (
            <ul className="activity-preview">
              {recentActivity.map(log => (
                <li key={log._id}>
                  <span className="activity-msg">{log.message}</span>
                  <span className="activity-time">
                    {timeAgo(log.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ===================== */}
      {/* HOUSEHOLD INSIGHTS */}
      {/* ===================== */}
      {analytics && (
        <div className="analytics-section">
          <h3 className="analytics-title">
            <BarChart3 size={20} /> Household Insights
          </h3>

          {/* QUICK STATS */}
          <div className="analytics-stats">
            <div className="stat-card">
              <span>Total Items</span>
              <strong>{analytics.summary.totalItems}</strong>
            </div>
            <div className="stat-card">
              <span>Active</span>
              <strong>{analytics.summary.active}</strong>
            </div>
            <div className="stat-card">
              <span>Consumed</span>
              <strong>{analytics.summary.consumed}</strong>
            </div>
            <div className="stat-card">
              <span>Wasted</span>
              <strong>{analytics.summary.wasted}</strong>
            </div>
          </div>

          {/* INSIGHTS GRID */}
          <div className="analytics-grid">
            {/* MOST USED */}
            {/* TRENDS */}
             <div className="analytics-card wide">
              <h4>
               <TrendingUp size={16} /> Consumption Trend
              </h4>
              <TrendsLineChart data={analytics.trends} />
              </div>

            

            {/* MOST WASTED */}
            <div className="analytics-card">
              <h4><AlertTriangle size={16} /> Waste Watch</h4>
              {analytics.mostWasted.length === 0 ? (
                <p className="muted-text">No wasted items 🎉</p>
              ) : (
                <ul>
                  {analytics.mostWasted.map(item => (
                    <li key={item.name}>{item.name}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* SUGGESTIONS */}
            <div className="analytics-card wide">
              <h4><Lightbulb size={16} /> Smart Suggestions</h4>
              {analytics.suggestions.length === 0 ? (
                <p className="muted-text">All looks good 👍</p>
              ) : (
                <ul>
                  {analytics.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* INVITE MODAL */}
      {showInvite && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setShowInvite(false)}>
              ×
            </button>
            <h3>Invite Code</h3>

            <div className="invite-box">{inviteCode}</div>

            <button onClick={copyInvite}>Copy</button>
            {copied && <p className="copied-text">Copied to clipboard</p>}
          </div>
        </div>
      )}
    </div>
  );
}
