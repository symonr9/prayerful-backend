
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
  notes: {
    type: String
  },
  leaderName: {
    type: String,
    required: true
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
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// export model user with GroupSchema
module.exports = mongoose.model("group", GroupSchema);
