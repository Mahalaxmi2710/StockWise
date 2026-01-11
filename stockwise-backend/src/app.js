const express=require("express");
const cors=require("cors");
const authRoutes = require("./routes/auth.routes");
const householdRoutes = require("./routes/household.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const alertRoutes = require("./routes/alert.routes");
const activityRoutes = require("./routes/activity.routes");
const userRoutes = require("./routes/user.routes");
const dashboardRoutes = require("./routes/dashboard.routes");



const app=express();


app.use(cors());
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("StockWise API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/households", householdRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/users",userRoutes);
app.use("/api/dashboard", dashboardRoutes);




module.exports=app;