const express = require("express");
const cors = require("cors");
const dbConnection = require("./src/connection/db-connection");

// Routers
const authRouter = require("./src/routers/auth.router");
const departmentRouter = require("./src/routers/department.router");
const userRouter = require("./src/routers/user.router");

const app = express();
const PORT = 8800;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRouter);
app.use("/api", departmentRouter);
app.use("/api", userRouter);

// Start server and connect to the database
app.listen(PORT, () => {
    dbConnection();
    console.log(`App is running on Port ${PORT}`);
});
