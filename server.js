const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: ["https://khatauligud.com", "https://www.khatauligud.com"],
  credentials: true
}));

app.use(express.json());

// Routes
const itemRoutes = require("./routes/itemRoutes");
app.use("/items", itemRoutes);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
