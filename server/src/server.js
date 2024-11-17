const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
const corsOptions = {
  origin: ["http://localhost:3000", "https://codemeet-backend.onrender.com", "http://localhost:5173"],
  methods: ["GET", "POST"],
  credentials: true,
};
app.use(cors(corsOptions));

// Database Connection
const dburl = process.env.DB_URI;
mongoose
  .connect(dburl)
  .then(() => console.log("Connected to DB Successfully"))
  .catch((error) => console.log("Error connecting to DB: ", error));

// Create HTTP Server
const httpServer = require("http").createServer(app);

// Attach Socket.IO to the HTTP server
const io = require("socket.io")(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://codemeet-backend.onrender.com", "http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

// Socket.IO logic
const usersPerProject = {};

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

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

// Express Routes
app.get("/test", (req, res) => {
  res.send("Testing");
});

// Start the server
const port = 3000;
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
