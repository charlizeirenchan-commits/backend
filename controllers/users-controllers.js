const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error"); // adapt to your project
const User = require("../models/user"); // adapt to your User model

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return next(new HttpError("Invalid inputs passed, please check your data.", 422));
  }

  const { name, email, password } = req.body;

  let imagePath = null;
  if (req.file) imagePath = req.file.path.replace(/\\/g, "/");

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return next(new HttpError("User exists already, please login instead.", 422));
    }

    const createdUser = new User({
      name,
      email,
      password, // replace with hashed password flow if needed
      image: imagePath,
      places: []
    });

    await createdUser.save();

    res.status(201).json({ userId: createdUser.id, email: createdUser.email });
  } catch (err) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return next(new HttpError("Signing up failed, please try again later.", 500));
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) { // replace with secure comparison if using hashing
      return next(new HttpError("Invalid credentials.", 401));
    }
    res.json({ userId: user.id, email: user.email });
  } catch (err) {
    return next(new HttpError("Logging in failed, please try again later.", 500));
  }
};
