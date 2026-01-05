const logActivity = require("../utils/activityLogger");
const InventoryItem = require("../models/InventoryItem");
const Household = require("../models/Household");

// Add inventory item
exports.addInventoryItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { householdId, name, category, quantity, unit, expiryDate, notes, purchaseDate } = req.body;

    // Check household & membership
    const household = await Household.findById(householdId);
    if (!household) return res.status(404).json({ message: "Household not found" });

    const member = household.members.find(m => m.userId.toString() === userId);
    if (!member) return res.status(403).json({ message: "You are not a member of this household" });

    if (!["OWNER", "EDITOR"].includes(member.role))
      return res.status(403).json({ message: "You don't have permission to add items" });

    // Create item
    const item = await InventoryItem.create({
      householdId,
      name,
      category,
      quantity,
      unit,
      expiryDate,
      notes,
      purchaseDate,
      createdBy: userId,
    });

    await logActivity({
  householdId,
  userId: req.user.userId,
  action: "ITEM_ADDED",
  entityType: "INVENTORY",
  entityId: item._id,
  message: `Item "${item.name}" added to inventory`,
});


    res.status(201).json({ message: "Inventory item added", item });
  } catch (err) {
    res.status(500).json({ message: "Failed to add inventory item", error: err.message });
  }
};

// Get all inventory items for a household
exports.getInventoryItems = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { householdId } = req.params;
    const includeDeleted = req.query.includeDeleted === "true"; // optional query param

    const household = await Household.findById(householdId);
    if (!household) return res.status(404).json({ message: "Household not found" });

    const member = household.members.find(m => m.userId.toString() === userId);
    if (!member) return res.status(403).json({ message: "You are not a member of this household" });

    // Build filter
    const filter = { householdId };
    if (!includeDeleted) filter.status = { $ne: "DELETED" };

    const items = await InventoryItem.find(filter);
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch inventory items", error: err.message });
  }
};



// Update inventory item
exports.updateInventoryItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const updates = req.body;

    const item = await InventoryItem.findById(id);
    if (!item)
      return res.status(404).json({ message: "Inventory item not found" });

    const household = await Household.findById(item.householdId);
    if (!household)
      return res.status(404).json({ message: "Household not found" });

    const member = household.members.find(
      (m) => m.userId.toString() === userId
    );

    if (!member || !["OWNER", "EDITOR"].includes(member.role))
      return res
        .status(403)
        .json({ message: "You don't have permission to update this item" });

    // ALLOW ONLY SAFE FIELDS
    const allowedUpdates = [
      "name",
      "category",
      "quantity",
      "unit",
      "expiryDate",
      "notes",
      "purchaseDate",
      "status",
    ];

    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        item[field] = updates[field];
      }
    });

    await item.save();

    await logActivity({
      householdId: item.householdId,
      userId,
      action: "ITEM_UPDATED",
      entityType: "INVENTORY",
      entityId: item._id,
      message: `Item "${item.name}" updated`,
    });

    res.json({ message: "Inventory item updated", item });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update inventory item",
      error: err.message,
    });
  }
};


// Soft delete / mark as consumed
exports.updateItemStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { status } = req.body; // "CONSUMED" or "ACTIVE"

    const item = await InventoryItem.findById(id);
    if (!item) return res.status(404).json({ message: "Inventory item not found" });

    const household = await Household.findById(item.householdId);
    const member = household.members.find(m => m.userId.toString() === userId);
    if (!member || !["OWNER", "EDITOR"].includes(member.role))
      return res.status(403).json({ message: "You don't have permission to update this item" });

    item.status = status;
    if (status === "CONSUMED") item.lastUsedAt = new Date();

    await item.save();

    if (status === "CONSUMED") {
      await logActivity({
        householdId: item.householdId,
        userId,
        action: "ITEM_CONSUMED",
        entityType: "INVENTORY",
        entityId: item._id,
        message: `Item "${item.name}" was consumed`,
      });
    }

    res.json({ message: "Inventory item status updated", item });
  } catch (err) {
    res.status(500).json({ message: "Failed to update inventory item status", error: err.message });
  }
};

//SOFT DELETE

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params; // use :id in routes
    const userId = req.user.userId;

    const item = await InventoryItem.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Check household & membership
    const household = await Household.findById(item.householdId);
    if (!household) return res.status(404).json({ message: "Household not found" });

    const member = household.members.find(m => m.userId.toString() === userId);
    if (!member || !["OWNER", "EDITOR"].includes(member.role)) {
      return res.status(403).json({ message: "You don't have permission to delete this item" });
    }

    if (item.status === "DELETED") {
      return res.status(400).json({ message: "Item already deleted" });
    }

    item.status = "DELETED";
    await item.save();

    await logActivity({
      householdId: item.householdId,
      userId,
      action: "ITEM_DELETED",
      entityType: "INVENTORY",
      entityId: item._id,
      message: `Item "${item.name}" deleted`,
    });

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete item",
      error: err.message,
    });
  }
};
