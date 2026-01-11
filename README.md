# StockWise - Smart Household Inventory & Alert System

A full-stack web application to manage household inventory with automated expiry alerts, activity tracking, and secure multi-user access.

This system helps users track inventory items, receive timely expiry alerts, and maintain transparency through detailed activity logs within shared households.

---

## 🚀 Features

### 🔐 Authentication & Access Control
- JWT-based authentication
- Protected backend routes
- Household-based access (users see only their households’ data)

### 📦 Inventory Management
- Add, update, consume, and delete inventory items
- Track expiry dates and item status (ACTIVE / EXPIRED)
- Centralized inventory per household

### ⏰ Automated Expiry Alerts
- Cron job runs daily to detect upcoming expiries
- Alerts generated for:
  - 7 days before expiry
  - 3 days before expiry
  - 1 day before expiry
- Severity levels: LOW, MEDIUM, HIGH, CRITICAL
- Alert acknowledgment system

### 📝 Activity Logs
- Logs all critical actions:
  - Inventory changes
  - Alert creation and acknowledgment
  - User and household events
- Grouped by time (Today / Yesterday / Earlier)
- Filterable by user, entity, and action

### 🎯 User Experience
- Filterable alerts (severity, acknowledgment status)
- Relative timestamps (e.g., “2 min ago”)
- Clean dark-themed UI for better readability

---

## 🛠️ Tech Stack

### Frontend
- React
- JavaScript
- CSS (custom dark theme)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- node-cron (scheduled tasks)



