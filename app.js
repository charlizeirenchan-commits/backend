const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const usersRoutes = require('./routes/users-routes');
const placesRoutes = require('./routes/places-routes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve uploaded images statically
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use('/api/users', usersRoutes);
app.use('/api/places', placesRoutes);

// global error handler - rollback uploaded file if error occurred after upload
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      if (err) console.log('Failed to delete file after error:', err);
    });
  }
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500).json({ message: error.message || 'An unknown error occurred!' });
});

const PORT = process.env.PORT || 5005;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/courtify';

mongoose.connect(MONGO_URL).then(() => {
  app.listen(PORT, () => {
    console.log('Server running on port', PORT);
  });
}).catch(err => {
  console.log(err);
});
