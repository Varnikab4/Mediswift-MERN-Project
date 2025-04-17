const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors"); // ✅ Import CORS
const connectDB = require("../config/db");
const path = require("path"); // ✅ Add this at the top


// dotenv config with correct path
dotenv.config({ path: "../dotenv/.env" });

// MongoDB connection
connectDB();

// Initialize express app
const app = express();

// ✅ Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Allow frontend URL
    credentials: true, // Allow cookies & authentication headers
  })
);

// // ✅ Handle Preflight Requests
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/user", require("../routes/userRoutes"));
app.use("/api/v1/admin", require("../routes/adminRoutes"));
app.use("/api/v1/doctor", require("../routes/doctorRoutes"));
app.use("/api/v1/profile", require("../routes/profileRoutes"));
app.use("/api/v1/news", require("../routes/newsRoutes"));


// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Default route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "An internal server error occurred!" });
});


// Server port
const port = process.env.PORT || 8080;

// Listen on port
app.listen(port, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${port}`.bgCyan.white
  );
});
