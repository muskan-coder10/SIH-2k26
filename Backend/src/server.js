const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Anndisha backend is running 🌾");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/farmer", require("./routes/farmerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/officer", require("./routes/officerRoutes"));
app.use("/api/chatbot", require("./routes/chatbotRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});