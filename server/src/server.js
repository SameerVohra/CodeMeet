const app = require("./app");
const cors = require("cors");
const http = require("http");
const { default: mongoose } = require("mongoose");
const { Server } = require("socket.io");

require("dotenv").config();

const dburl = process.env.DB_URI;
const server = http.createServer(app);
const corsOption = {
  origin: "*",
  credentials: true,
};

const io = new Server(server, {
  cors: corsOption,
});

const port = 3000

mongoose
  .connect(dburl)
  .then(() => console.log("Connected to DB Successfully"))
  .catch((error) => console.log("Error connecting to DB: ", error));

io.on("connection", (socket) => {
  socket.on("joinProject", ({ projId, email }) => {
    socket.data.projId = projId;
    socket.data.email = email;
    io.to(projId).emit("user:joined", ({email, projId}));
    socket.join(projId);
  });

  socket.on("writing", ({ projId, text }) => {
    socket.to(projId).emit("updatedText", text);
  });

  socket.on("langChange", ({ projId, newLang }) => {
    socket.to(projId).emit("newLang", newLang);
  });

  socket.on("leave:project", ({email, projId})=>{
    console.log("leave:project called")
    socket.to(projId).emit("user:disconnected", email)
  })

  socket.on("disconnect", ()=>{
    console.log(`${socket.id} disconnected`);
  })
  socket.emit("message", "Welcome to the project");
});

server.listen(port, () => {
  console.log(`Started listening to port ${port}`);
});
