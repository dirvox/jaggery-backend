import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import itemRoutes from "./routes/itemRoutes.js";
import emailRouter from "./routes/emailRoutes.js";

dotenv.config();

const app = express();

// ✅ CORS setup
app.use(
  cors({
    origin: [
      "https://khatauligud.com",
      "https://www.khatauligud.com",
      "http://localhost:3000",
      "https://admin.khatauligud.com",
      "http://localhost:5173"
    ],
    credentials: true,
  })
);

// ✅ Parse JSON bodies
app.use(express.json({ limit: "2mb" }));

// ✅ Routes

// fo local
app.use("/api/items", itemRoutes);
app.use("/api/email", emailRouter);

// for server 
// app.use("/items", itemRoutes);
// app.use("/email", emailRouter);


// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Start server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
