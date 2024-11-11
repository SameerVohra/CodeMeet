const Project = require("../models/Project");

const SaveCode = async(req, res) => {
  const {code, projId, lang} = req.body;
  try {
    const project = await Project.findOne({code: projId});
    if(!project){
      res.status(404).send("No project found");
      return;
    }

    if(lang==='cpp'){
      project.user_code[0].input=code;
    }
    else if(lang==='python'){
      project.user_code[1].input=code;
    }
    else{
      project.user_code[2].input=code;
    }
    await project.save();
    res.status(201).send(project)
  } catch (error) {
    console.log(error);
    res.status(501).send("Internal Server Error");
  }
}

module.exports = SaveCode;
