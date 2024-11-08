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
  credentials: true
};

const io = new Server(server, {
  cors: corsOption
});

const port = 3000;

mongoose
  .connect(dburl)
  .then(() => console.log("Connected to DB Successfully"))
  .catch((error) => console.log("Error connecting to DB: ", error));

io.on("connection", (socket) => {
  console.log(`User with socket id: ${socket.id} connected`);

  socket.on("joinProject", ({ projId, email }) => {
    socket.join(projId);
    socket.join(`${projId}-video-room`);
    socket.to(`${projId}-video-room`).emit("userJoinedVideo", {email, socketId: socket.id})
    console.log(`User ${email} joined project ${projId}`);
  });

  socket.on("writing", ({ projId, text }) => {
    socket.to(projId).emit("updatedText", text);
  });

  socket.on("langChange", ({ projId, newLang }) => {
    socket.to(projId).emit("newLang", newLang);
  });

  socket.on("user", ({projId, user})=>{
    socket.to(projId).emit("user", {user, sender: socket.id})
  })

  socket.on("signal", (data)=>{
    const {signal, socketId} = data;
    io.to(socketId).emit("signal", {signal, sender: socket.id});
  })

  socket.on("user", ({projId, user})=>{
    socket.to(projId).emit("user", { user, sender: socket.id });
  })
  
  socket.on("disconnect", () => {
    console.log(`User with socket id: ${socket.id} disconnected`);
    socket.broadcast.emit("userDisconnected", { socketId: socket.id });
  });

  socket.emit("message", "Welcome to the project");
});

server.listen(port, () => {
  console.log(`Started listening to port ${port}`);
});
