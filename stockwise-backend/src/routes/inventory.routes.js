const express = require("express");
const {
  addInventoryItem,
  getInventoryItems,
  updateInventoryItem,
  updateItemStatus,
  deleteItem
} = require("../controllers/inventory.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/add", authMiddleware, addInventoryItem);
router.get("/:householdId", authMiddleware, getInventoryItems);
router.put("/:id", authMiddleware, updateInventoryItem); //inventory id
router.patch("/:id/status", authMiddleware, updateItemStatus);//inventory id
router.delete("/:id", authMiddleware, deleteItem);



module.exports = router;
