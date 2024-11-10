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

const port = 3000;

const users = new Map();

mongoose
  .connect(dburl)
  .then(() => console.log("Connected to DB Successfully"))
  .catch((error) => console.log("Error connecting to DB: ", error));

io.on("connection", (socket) => {
  console.log(`User with socket id: ${socket.id} connected`);

  socket.on("joinProject", ({ projId, email }) => {
    users.set(socket.id, email);
    socket.join(projId);
    io.to(projId).emit("greet", Array.from(users.values()));
    console.log(`User ${email} joined project ${projId}`);
  });

  socket.on("writing", ({ projId, text }) => {
    socket.to(projId).emit("updatedText", text);
  });

  socket.on("langChange", ({ projId, newLang }) => {
    socket.to(projId).emit("newLang", newLang);
  });

  socket.on("disconnect", () => {
    const email = users.get(socket.id);
    if (email) {
      users.delete(socket.id);
      console.log(`User ${email} with socket id: ${socket.id} disconnected`);
      io.emit("remove", email);
      // Emit updated user list to everyone after a user disconnects
      io.emit("greet", Array.from(users.values()));
    }
  });

  socket.emit("message", "Welcome to the project");
});

server.listen(port, () => {
  console.log(`Started listening to port ${port}`);
});
