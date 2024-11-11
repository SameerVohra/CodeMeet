const Project = require("../models/Project");
const ProjId = require("../ProjId");
const ProjPass = require("../ProjPass")

const MakeProject = async(req, res) => {
  const {email, projName} = req.body;
  try {
    const code = ProjId();
    const password = ProjPass();

    const newProj = new Project({
      email,
      projName,
      code,
      password,
      user_code: [{lang: "cpp", input: ""}, {lang: "python", input: ""}, {lang: "c", input: ""}]
    })
    await newProj.save();
    res.status(201).json({code: code, password: password, status:201});
  } catch (error) {
    console.log(error)
    res.status(501).send("Internal Server Error");
  }
}

module.exports = MakeProject;
