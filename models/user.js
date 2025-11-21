const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  password: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, ref: 'Place' }]
});

module.exports = mongoose.model('User', userSchema);
