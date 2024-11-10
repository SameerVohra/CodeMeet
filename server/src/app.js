const express = require("express");
const Register = require("./controllers/Register");
const Login = require("./controllers/Login");
const cors = require("cors");
const MakeProject = require("./controllers/MakeProject");
const GetProjects = require("./controllers/GetProjects");
const JoinProject = require("./controllers/JoinProject");
const GetProjectDetails = require("./controllers/GetProjectDetails");
const SaveCode = require("./controllers/SaveCode");
const bodyParser = require("body-parser");
const CompileCode = require("./controllers/CompileCode");
const GetJoinedUsers = require("./controllers/GetJoinedUsers");
const AddJoinedUsers = require("./controllers/AddJoinedUsers");
const RemoveJoinedUser = require("./controllers/RemoveJoinedUser");

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json());

app.post("/register", Register);
app.post("/login", Login);
app.post("/make-project", MakeProject);
app.get("/get-projects", GetProjects);
app.post("/join-project", JoinProject);
app.get("/get-project-details", GetProjectDetails)
app.post("/save-code", SaveCode);
app.post("/compile", CompileCode);
app.get("/get-joined-users", GetJoinedUsers);
app.post("/add-joined-user", AddJoinedUsers);
app.patch("/remove-user", RemoveJoinedUser);
module.exports = app;
