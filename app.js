const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const usersRoutes = require("./routes/users-routes");
const placesRoutes = require("./routes/places-routes");

const app = express();

app.use(bodyParser.json());

// Serve images statically from /uploads/images
app.use("/uploads/images", express.static(path.join("uploads", "images")));

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

// API routes
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

// Global error handler - rollback uploaded file if present
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      if (err) console.log("Failed to delete file after error:", err);
    });
  }
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500).json({ message: error.message || "An unknown error occurred!" });
});

// start (replace MONGO_URL with your connection)
const PORT = process.env.PORT || 5005;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/myapp";

mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));
