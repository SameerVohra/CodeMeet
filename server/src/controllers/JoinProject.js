const Project = require("../models/Project");

const JoinProject = async(req, res) => {
  const {code, password} = req.body;
  try {
    const project = await Project.findOne({code});
    if(!project){
      res.status(404).send("No Such Project Found");
      return; 
    }
    if(project.password!==password){
      res.status(403).send("Password is Incorrect");
      return;
    }
    res.status(201).json(project);
  } catch (error) {
    console.log(error);
    res.status(501).send("Internal Server Error");
    return;
  }
}

module.exports = JoinProject;
