const Project = require("../models/Project");

const SaveCode = async(req, res) => {
  const {code, projId} = req.body;
  try {
    const project = await Project.findOne({code: projId});
    if(!project){
      res.status(404).send("No project found");
      return;
    }

    project.user_input = code;
    await project.save();
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
}

module.exports = SaveCode;
