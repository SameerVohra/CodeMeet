const { default: mongoose } = require("mongoose");

const UserModel = new mongoose.Schema({
  email: String,
  password: String
})

const User = mongoose.model("User", UserModel);
module.exports = User;
