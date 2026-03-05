const express = require("express")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.routes")
const transactionRouter = require("./routes/transaction.routes")   
const budgetRouter = require("./routes/budget.routes"); 

const cors = require("cors");
const app = express()


app.use(express.json())
app.use(cookieParser())


app.use("/api/auth", authRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/budgets", budgetRouter);


app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // adjust port (if needed)
app.use(express.json());


module.exports = app 