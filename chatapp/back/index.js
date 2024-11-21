const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const authRouter = require("./routers/authRoute");
const app = express();
const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

dotenv.config();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use("/auth", authRouter);

io.on("connect", (socket) => {});
server.listen(4000, () => console.log("listening on port 4000"));
// app.listen(3000, () => console.log("listening on port 3000"));
