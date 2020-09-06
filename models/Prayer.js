
const mongoose = require("mongoose");

//Has "_id" default primary key property
const PrayerSchema = mongoose.Schema({
  urlId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String
  },
  notes: {
    type: String
  },
  groups: {
    type: [String]
  },
  image: {
    type: String
  },
  type: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String, //mongoDB doesn't have foreign keys, just put in literal of _id property. Docs based
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// export model user with PrayerSchema
module.exports = mongoose.model("prayer", PrayerSchema);
