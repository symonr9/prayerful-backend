
const mongoose = require("mongoose");

//Has "_id" default primary key property
const GroupSchema = mongoose.Schema({
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
  notes1: {
    type: String
  },
  notes2: {
    type: String
  },
  notes3: {
    type: String
  },
  leaderName: {
    type: String,
    required: true
  },
  leaderId: {
    type: String
  },
  image: {
    type: String
  },
  type: {
    type: String,
    required: true,
    default: 'normal'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// export model user with GroupSchema
module.exports = mongoose.model("group", GroupSchema);
