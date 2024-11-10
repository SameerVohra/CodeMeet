const Project = require("../models/Project");

const AddJoinedUsers = async(req, res) => {
  const {email, projId} = req.body;

  try {
    const project = Project.findOne({code: projId});
    if(project.joined_users.include(email)){
      res.status(401).send("User already joined");
      return ;
    }
    
    project.joined_users.push(email);
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
}

module.exports = AddJoinedUsers;
