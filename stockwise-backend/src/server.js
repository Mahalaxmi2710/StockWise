require("dotenv").config();
require("./cron/expiryCheck.job");
require("./cron/activityCleanup");

const app=require("./app");
const connectDB=require("./config/db");

connectDB();

const PORT=process.env.PORT||5000;
app.listen(PORT,()=>
    console.log(`Server running on port ${PORT}`)
);