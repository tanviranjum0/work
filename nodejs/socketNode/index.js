const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

//Socket.io

io.on("connection", (client) => {
  client.on("user-message", (msg) => {
    io.emit("message", msg);
  });
});
app.use(express.static("/public"));
app.get("/", (req, res) => {
  res.sendFile(path.resolve("./public/index.html"));
});

server.listen(8000, () => {
  console.log("server started successfully");
});
