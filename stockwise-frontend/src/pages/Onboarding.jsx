import { useState } from "react";
import { createHousehold, joinHousehold } from "../api/households";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Onboarding() {
  const navigate = useNavigate();

  const [householdName, setHouseholdName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { refreshUser } = useAuth();

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createHousehold({ name: householdName });
      await refreshUser();
      navigate("/households");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create household");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await joinHousehold({ inviteCode });
      await refreshUser();
      navigate("/households");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join household");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ob-container">
      <nav className="ob-navbar">
        <h2 className="ob-logo">StockWise</h2>
      </nav>

      <div className="ob-content">
        <h1>Let’s Get You Started</h1>
        <p>Create a new household or join an existing one</p>

        {error && <div className="ob-error">{error}</div>}

        <div className="ob-cards">
          {/* Create */}
          <form className="ob-card" onSubmit={handleCreate}>
            <h3>Create Household</h3>
            <p>Set up a new household and invite members</p>

            <input
              type="text"
              placeholder="Household name"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Household"}
            </button>
          </form>

          {/* Join */}
          <form className="ob-card" onSubmit={handleJoin}>
            <h3>Join Household</h3>
            <p>Enter an invite code to join a household</p>

            <input
              type="text"
              placeholder="Invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Joining..." : "Join Household"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
