const app = require("./app")
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io");

require("dotenv").config();

const server = http.createServer(app);

const corsOption = {
  origin: "*",
  credentials: true
}

const io = new Server(server, {
  cors:{corsOption}
})

const port = 3000;

io.on("connection", (socket)=>{
  console.log("A new user joined with socked id: ", socket.id)
  socket.on("message", (data)=>{
    console.log(data);
  })

  socket.on("disconnect", ()=>{
    console.log(`User with socket id: ${socket.id} disconnected`);
  })

  socket.emit("message", "Welcome to the project")
})


server.listen(port, ()=>{
  console.log(`Started listening to port ${port}`);
})
