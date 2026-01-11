const mongoose = require("mongoose");
const Inventory = require("../models/InventoryItem");
const ActivityLog = require("../models/ActivityLog");
const Household = require("../models/Household");
/**
 * GET Dashboard Analytics
 */
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const { householdId } = req.params;
    const userId = req.user.userId;

    /* ================================
       VERIFY HOUSEHOLD ACCESS
    ================================= */
    const household = await Household.findById(householdId);

    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }

    const isMember = household.members.some(
      m => m.userId.toString() === userId
    );

    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    /* ================================
       1. INVENTORY SUMMARY
    ================================= */
    const inventoryItems = await Inventory.find({ householdId: householdId });

    const summary = {
      totalItems: inventoryItems.length,
      active: inventoryItems.filter(i => i.status === "ACTIVE").length,
      consumed: inventoryItems.filter(i => i.status === "CONSUMED").length,
      wasted: inventoryItems.filter(i =>
        i.status === "DELETED" ||
        (i.expiryDate && new Date(i.expiryDate) < new Date() && i.status !== "CONSUMED")
      ).length
    };

    /* ================================
       2. MOST USED ITEMS
    ================================= */
    const mostUsedAggregation = await ActivityLog.aggregate([
      {
        $match: {
          householdId: new mongoose.Types.ObjectId(householdId),
          action: "ITEM_CONSUMED"
        }
      },
      {
        $group: {
          _id: "$entityId",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    const mostUsed = await Promise.all(
      mostUsedAggregation.map(async (item) => {
        const inventory = await Inventory.findById(item._id);
        return inventory
          ? { name: inventory.name, count: item.count }
          : null;
      })
    );

    /* ================================
       3. MOST WASTED ITEMS
    ================================= */
    const wastedItems = inventoryItems
      .filter(i =>
        i.status === "DELETED" ||
        (i.expiryDate && new Date(i.expiryDate) < new Date() && i.status !== "CONSUMED")
      )
      .slice(0, 3)
      .map(i => ({
        name: i.name,
        expiryDate: i.expiryDate
      }));

    /* ================================
       4. CONSUMPTION TREND (Last 7 Days)
    ================================= */
    const trendAggregation = await ActivityLog.aggregate([
      {
        $match: {
          householdId: new mongoose.Types.ObjectId(householdId),
          action: "ITEM_CONSUMED"
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const trends = trendAggregation.map(t => ({
      date: t._id,
      count: t.count
    }));

    /* ================================
       5. SMART SUGGESTIONS
    ================================= */
    const suggestions = [];

    if (summary.wasted > summary.consumed) {
      suggestions.push("High waste detected. Review expiry alerts and quantities.");
    }

    if (summary.consumed > 10) {
      suggestions.push("Items are being actively consumed. Consider bulk planning.");
    }

    if (mostUsed.length > 0) {
      suggestions.push(`Frequently used item: ${mostUsed[0]?.name}`);
    }

    /* ================================
       FINAL RESPONSE
    ================================= */
    res.status(200).json({
      summary,
      mostUsed: mostUsed.filter(Boolean),
      mostWasted: wastedItems,
      trends,
      suggestions
    });

  } catch (error) {
    console.error("Dashboard analytics error:", error);
    res.status(500).json({ message: "Failed to load dashboard analytics" });
  }
};
