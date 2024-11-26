const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const { sessionMiddleware } = require("./controllers/serverController");
const helmet = require("helmet");
const { wrap } = require("./controllers/serverController");
const authRouter = require("./routers/authRoute");
const {
  authorizeUser,
  addFriend,
  initializeUser,
} = require("./controllers/socketController");
const app = express();
const server = require("http").createServer(app);
app.use(helmet());
app.use(express.json());
dotenv.config();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(sessionMiddleware());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/auth", authRouter);
io.use(wrap(sessionMiddleware()));
io.use(authorizeUser);
io.on("connect", (socket) => {
  initializeUser(socket);
  socket.on("add_friend", (friendName, cb) => {
    addFriend(socket, friendName, cb);
  });
});
server.listen(4000, () => console.log("listening on port 4000"));
