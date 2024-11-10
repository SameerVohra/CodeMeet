const Project = require("../models/Project");

const RemoveJoinedUser = async(req, res) => {
  const {email, projId} = req.body;

  try {
    const project = await Project.findOne({code: projId});
    if(!project){
      res.status(404).send("No such project found");
      return;
    }
    const users = project.joined_users;
    users.filter((user)=>user!==email);
    project.joined_users = users;

    await project.save();

    res.status(201).send(project);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
}

module.exports = RemoveJoinedUser;
