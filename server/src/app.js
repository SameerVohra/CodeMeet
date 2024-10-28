const express = require("express");
const Register = require("./controllers/Register");
const Login = require("./controllers/Login");
const cors = require("cors");
const MakeProject = require("./controllers/MakeProject");
const GetProjects = require("./controllers/GetProjects");
const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.post("/register", Register)
app.post("/login", Login)
app.post("/make-project", MakeProject)
app.get("/get-projects", GetProjects);

module.exports = app;
