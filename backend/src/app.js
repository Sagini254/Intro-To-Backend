import express from "express";

const app = express(); // create an express app

app.use(express.json());

// routes import
import userRoutes from "./routes/user.route.js";

// route declaration
app.use("/api/v1/users", userRoutes);

//example route: http://localhost:3000/api/v1/users/register

export default app;
