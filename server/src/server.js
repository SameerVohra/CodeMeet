const app = require("./app")
const cors = require("cors");
const http = require("http");
const { default: mongoose } = require("mongoose");
const {Server} = require("socket.io");

require("dotenv").config();

const dburl = process.env.DB_URI;
const server = http.createServer(app);
const corsOption = {
  origin: "*",
  credentials: true
}

const io = new Server(server, {
  cors:corsOption
})

const port = 3000;

mongoose
  .connect(dburl)
  .then(()=>
    console.log("Connected to DB Successfuly")
  )
  .catch((error)=>
    console.log("Error connecting to DB: ", error)
  )

io.on("connection", (socket)=>{
  socket.on("joinProject", ({projId, email}) => {
    socket.join(projId);
    console.log(`User ${email} joined project ${projId}`);
  });

  socket.on("writing", ({projId, text})=>{
    socket.to(projId).emit("updatedText", text);
  })

  socket.on("disconnect", ()=>{
    console.log(`User with socket id: ${socket.id} disconnected`);
  })

  socket.emit("message", "Welcome to the project")
})


server.listen(port, ()=>{
  console.log(`Started listening to port ${port}`);
})
