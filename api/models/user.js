const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true , unique: true},
  password: { type: String, required: true, minlength: 8},
  bio: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  job: { type: String },
  location: { type: String },
  relationshipStatus: { type: String },
  birthdate: { type: String }, /// not sure which format to add birth date to mongodb
  gender: { type: String },
  profileImage: { type: String },  //images
  backgroundImage: { type: String, default: null } // background image for profile
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
