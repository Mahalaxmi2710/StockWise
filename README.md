## 📦 StockWise — Smart Household Inventory & Alert System

StockWise is a full-stack household inventory management system designed to help users track items, monitor expiry dates, reduce waste, and gain meaningful insights through analytics.
It supports multi-user households, secure access control, real-time activity logging, and smart consumption trends.

---

## 🚀 Features

### 🔐 Authentication & Security
- JWT-based authentication
- Session expiry with forced re-login
- Secure role-based household access
- Protected routes (frontend & backend)

### 🏠 Household Management
- Create and join households using invite codes
- Household-scoped inventory and activity
- Member-only access enforcement

### 📦 Inventory Management
- Add, update, consume, and delete items
- Track item quantities and expiry dates
- Automatic classification: Active / Consumed / Wasted

### ⏰ Automated Expiry Alerts
- Cron job runs daily to detect upcoming expiries
- Alerts generated for:
  - 7 days before expiry
  - 3 days before expiry
  - 1 day before expiry
- Severity levels: LOW, MEDIUM, HIGH, CRITICAL
- Alert acknowledgment system

### 📊 Dashboard & Analytics
- Inventory summary (total, active, consumed, wasted)
- Most used and most wasted items
- Consumption trend visualization (SVG line chart)
- Smart suggestions based on usage patterns

### 📝 Activity Logs
- Logs all critical actions:
  - Inventory changes
  - Alert creation and acknowledgment
  - User and household events
- Grouped by time (Today / Yesterday / Earlier)
- Filterable by user, entity, and action

### 🎨 UI & UX
- Filterable alerts (severity, acknowledgment status)
- Relative timestamps (e.g., “2 min ago”)
- Clean dark-themed UI for better readability
- Mobile-friendly hamburger navigation
- Smooth, modern, theme-consistent styling

---

## 🛠️ Tech Stack

### Frontend
- React
- React Router
- Axios
- JavaScript
- CSS (custom dark theme)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- node-cron (scheduled tasks)



