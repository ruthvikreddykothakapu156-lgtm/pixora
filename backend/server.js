const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
connectDB();
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/photographers", require("./routes/photographerRoutes"));
app.use("/api/albums", require("./routes/albumRoutes"));
app.use("/api/photos", require("./routes/photoRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.get("/", (req, res) => {
  res.send("Photography Portfolio API is running");
});
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));