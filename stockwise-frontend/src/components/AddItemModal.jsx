import { useState } from "react";

export default function AddItemModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "pieces",
    expiryDate: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Add Inventory Item</h3>

        <form onSubmit={handleSubmit} className="modal-form">
          <input
            name="name"
            placeholder="Item name"
            required
            onChange={handleChange}
          />

          <input
            name="category"
            placeholder="Category"
            onChange={handleChange}
          />

          <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            required
            onChange={handleChange}
          />

          <select name="unit" onChange={handleChange}>
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="litre">litre</option>
            <option value="ml">ml</option>
            <option value="pieces">pieces</option>
          </select>

          <input
            type="date"
            name="expiryDate"
            required
            onChange={handleChange}
          />

          <textarea
            name="notes"
            placeholder="Notes (optional)"
            onChange={handleChange}
          />

          <div className="modal-actions">
            <button type="submit" className="btn primary">
              Add Item
            </button>
            <button
              type="button"
              className="btn secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
