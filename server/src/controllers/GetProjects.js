const Project = require("../models/Project");

const GetProjects = async(req, res)=>{
  const {email} = req.query;

  try {
    const projects = await Project.find({email});
    if(!projects){
      return ;
    }
    res.status(201).json({projects})
  } catch (error) {
    res.status(501).send("Internal Server Error");
    return;
  }
}

module.exports = GetProjects;
