const { default: mongoose } = require("mongoose");

const ProjectModel = new mongoose.Schema({
  email: String,
  projName: String,
  code: String,
  password: String
})

const Project = mongoose.model("Project", ProjectModel);
module.exports = Project;
