const app = require("./app");
const cors = require("cors");
const { default: mongoose } = require("mongoose");

require("dotenv").config();

const dburl = process.env.DB_URI;

const httpServer = require("http").createServer(app);
const options = {
  cors: {
    origin: ["http://localhost:3000", "https://codemeet-backend.onrender.com", "http://localhost:5173"],
  },
};
const io = require("socket.io")(httpServer, options);

app.use(cors(options));
app.options("*", cors(options)); 

const port = 3000;

mongoose
  .connect(dburl)
  .then(() => console.log("Connected to DB Successfully"))
  .catch((error) => console.log("Error connecting to DB: ", error));

const usersPerProject = {};

// Socket.IO connection
io.on("connection", (socket) => {
  console.log(socket, " joined")
  socket.on("joinProject", ({ projId, email }) => {
    socket.data.projId = projId;
    socket.data.email = email;
    
    if (!usersPerProject[projId]) {
      usersPerProject[projId] = new Set();
    }

    usersPerProject[projId].add(email);
    socket.join(projId);
    
    io.to(projId).emit("user:joined", { usersJoined: Array.from(usersPerProject[projId]) });
    
    console.log(`User ${email} joined project ${projId}`);
  });

  socket.on("writing", ({ projId, text }) => {
    socket.to(projId).emit("updatedText", text);
  });

  socket.on("langChange", ({ projId, newLang }) => {
    socket.to(projId).emit("newLang", newLang);
  });

  socket.on("leave:project", ({ email, projId }) => {
    console.log(`User ${email} leaving project ${projId}`);
    if (usersPerProject[projId]) {
      usersPerProject[projId].delete(email);
      io.to(projId).emit("user:disconnected", { usersJoined: Array.from(usersPerProject[projId]) });
    }
  });

  socket.on("disconnect", () => {
    const { projId, email } = socket.data;
    if (projId && email && usersPerProject[projId]) {
      usersPerProject[projId].delete(email);
      io.to(projId).emit("user:disconnected", { projId, email, usersJoined: Array.from(usersPerProject[projId]) });
    }
    console.log(`${socket.id} disconnected`);
  });

  socket.emit("message", "Welcome to the project");
});

app.get("/test", (req, res)=>{
  res.send("Testing")
})

app.listen(port, () => {
  console.log(`Started listening to port ${port}`);
});
