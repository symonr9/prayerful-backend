
const mongoose = require("mongoose");

//Has "_id" default primary key property
const PrayerSchema = mongoose.Schema({
  urlId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  about: {
    type: String
  },
  leaderName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    default: 'normal'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// export model user with PrayerSchema
module.exports = mongoose.model("prayer", PrayerSchema);
