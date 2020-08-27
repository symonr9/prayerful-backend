const mongoose = require("mongoose");

//Has "_id" default primary key property
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  image: {
    type: String
  },
  groups: {
    type: [String]
  },
  prayers: {
    type: [String]
  },
  type: {
    type: String,
    required: true,
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});


// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);