
const mongoose = require("mongoose");

//Has "_id" default primary key property
const PrayerSchema = mongoose.Schema({
  urlId: {
    type: String,
    required: true,
    unique: true
  },
  text: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    required: true
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
    default: false
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
