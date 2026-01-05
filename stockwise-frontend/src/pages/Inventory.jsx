import { useEffect, useState, useMemo } from "react";
import {
  getInventoryItems,
  addInventoryItem,
  updateInventoryItem,
  updateItemStatus,
  deleteItem,
} from "../api/inventory";
import { useAuth } from "../context/AuthContext";
import AddItemModal from "../components/AddItemModal";
import EditItemModal from "../components/EditItemModal";

export default function Inventory() {
  const { user } = useAuth();
  const activeHousehold = localStorage.getItem("activeHousehold");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [deleteItemId, setDeleteItemId] = useState(null);


  const householdMeta = user?.households?.find(
    (h) => h.householdId?._id === activeHousehold
  );

  const role = householdMeta?.role;
  const canEdit = role === "OWNER" || role === "EDITOR";

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await getInventoryItems(activeHousehold);
      setItems(res.data.items);
    } catch {
      setError("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeHousehold) fetchItems();
  }, [activeHousehold]);

  const isExpired = (date) => new Date(date) < new Date();

  const filteredItems = useMemo(() => {
    if (filter === "ALL") return items;
    if (filter === "ACTIVE")
      return items.filter(
        (i) => i.status === "ACTIVE" && !isExpired(i.expiryDate)
      );
    if (filter === "CONSUMED")
      return items.filter((i) => i.status === "CONSUMED");
    if (filter === "EXPIRED")
      return items.filter(
        (i) => i.status === "ACTIVE" && isExpired(i.expiryDate)
      );
    return items;
  }, [items, filter]);

  const handleAdd = async (data) => {
    await addInventoryItem({ ...data, householdId: activeHousehold });
    setShowAdd(false);
    fetchItems();
  };

  const handleUpdate = async (id, updates) => {
    await updateInventoryItem(id, updates);
    setEditingItem(null);
    fetchItems();
  };

  const handleStatus = async (id, status) => {
    await updateItemStatus(id, { status });
    fetchItems();
  };

  const handleDelete = async (id) => {
    await deleteItem(id);
    fetchItems();
  };

  if (!activeHousehold) return <p>No household selected</p>;
  if (loading) return <p>Loading inventory...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <h2>Inventory</h2>

        {canEdit && (
          <button
            className="btn primary"
            onClick={() => setShowAdd(true)}
          >
            + Add Item
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="inventory-filters">
        {["ALL", "ACTIVE", "CONSUMED", "EXPIRED"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="inventory-card">
        {filteredItems.length === 0 ? (
          <p className="empty-text">No items found for this view</p>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Expiry</th>
                <th>Status</th>
                {canEdit && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const expired = isExpired(item.expiryDate);

                return (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit}</td>
                    <td>
                      {new Date(item.expiryDate).toLocaleDateString()}
                      {expired && (
                        <span className="expired-tag">Expired</span>
                      )}
                    </td>
                    <td>
                      <span className={`status ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>

                    {canEdit && (
                      <td className="actions">
                        <button
                          className="btn small"
                          onClick={() => setEditingItem(item)}
                        >
                          Edit
                        </button>

                        {item.status === "ACTIVE" && (
                          <button
                            className="btn small warn"
                            onClick={() =>
                              handleStatus(item._id, "CONSUMED")
                            }
                          >
                            Consume
                          </button>
                        )}

                        {item.status === "CONSUMED" && (
                          <button
                            className="btn small secondary"
                            onClick={() =>
                              handleStatus(item._id, "ACTIVE")
                            }
                          >
                            Restore
                          </button>
                        )}

                        <button
                          className="btn small danger"
                          onClick={() => setDeleteItemId(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showAdd && (
        <AddItemModal
          onClose={() => setShowAdd(false)}
          onSubmit={handleAdd}
        />
      )}

      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={handleUpdate}
        />
      )}

      {deleteItemId && (
  <div className="confirm-overlay">
    <div className="confirm-box">
      <p>Are you sure you want to delete this item?</p>

      <div className="confirm-actions">
        <button
          className="btn danger"
          onClick={() => {
            handleDelete(deleteItemId);
            setDeleteItemId(null);
          }}
        >
          Yes, Delete
        </button>

        <button
          className="btn secondary"
          onClick={() => setDeleteItemId(null)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
