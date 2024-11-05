const Project = require("../models/Project");

const GetProjectDetails = async(req, res) => {
  const {projId} = req.query;
  try {
    const project = await Project.findOne({code: projId})
    if(!project){
      res.status(404).send("No such project found");
      return ;
    }
    res.status(201).json(project);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
}

module.exports = GetProjectDetails
