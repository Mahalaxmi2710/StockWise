import { useState } from "react";

export default function EditItemModal({ item, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: item.name,
    category: item.category || "",
    quantity: item.quantity,
    unit: item.unit,
    expiryDate: item.expiryDate.slice(0, 10),
    notes: item.notes || "",
    status: item.status,
  });

  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFinalSubmit = () => {
    onSubmit(item._id, form);
    setShowConfirm(false);
  };

  return (
    <>
      {/* Main modal overlay */}
      <div className="modal-overlay">
        <div className="modal-box">
          <h3>Edit Inventory Item</h3>

          <form onSubmit={(e) => e.preventDefault()}>
            <input name="name" value={form.name} onChange={handleChange} />
            <input name="category" value={form.category} onChange={handleChange} />
            <input name="quantity" type="number" value={form.quantity} onChange={handleChange} />

            <select name="unit" value={form.unit} onChange={handleChange}>
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="litre">litre</option>
              <option value="ml">ml</option>
              <option value="pieces">pieces</option>
            </select>

            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
            />

            <textarea name="notes" value={form.notes} onChange={handleChange} />

            <select name="status" value={form.status} onChange={handleChange}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="CONSUMED">CONSUMED</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>

            <div className="modal-actions">
              <button type="button" onClick={() => setShowConfirm(true)}>
                Save
              </button>
              <button type="button" className="secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>Are you sure you want to update this item?</p>

            <div className="confirm-actions">
              <button onClick={handleFinalSubmit}>Yes, Update</button>
              <button className="secondary" onClick={() => setShowConfirm(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
