import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import connection from "./database/db.js";
import dotenv from "dotenv";
import User from "./models/user.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import registerRoute from "./routes/registerRoute.js";
import loginRoute from "./routes/loginRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import allUserRoute from "./routes/allUserRoute.js"
import messageRoute from "./routes/messageRoute.js"
// import { allUsers } from "./controllers/userController.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

connection();

app.get("/", (req, res) => {
  res.send("API is running..");
});
app.use("/api/chat", chatRoutes);
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/api/user", allUserRoute);
app.use("/api/message",messageRoute);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is running at port http://localhost:${PORT}`);
});
