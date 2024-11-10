const Project = require("../models/Project")
const GetJoinedUsers = async(req, res) => {
  const {projId} = req.query;
  try {
    const project = Project.findOne({code: projId});
    if(!project){
      res.status(404).send("No such project found");
      return ;
    }
    res.status(201).send(project.joined_users);
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
}

module.exports = GetJoinedUsers;
