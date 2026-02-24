const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const dns = require("dns");  

dns.setDefaultResultOrder("ipv4first");  


require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
 const budgetRoutes = require("./routes/budgetRoutes");
 const transactionRoutes = require("./routes/transactionRoutes");
const app = express();



// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
 app.use("/api/budgets", budgetRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // 5 seconds ka intezar karega
  })
  .then(() => {
    console.log(" MongoDB Connected");
  })
  .catch((err) => {
    console.error(" MongoDB Connection Failed:", err.message);
  });



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
