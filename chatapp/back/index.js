const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const session = require("express-session");
const authRouter = require("./routers/authRoute");
const RedisStore = require("connect-redis").default;
const redisClient = require("./redis");
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

app.use(
  session({
    secret: "knwdvlbwlbvlen",
    credentials: true,
    name: "sid",
    store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.ENVIRONMENT === "production" ? "true" : "auto",
      httpOnly: true,
      expires: 1000 * 60 * 60 * 24 * 30, // 1 hour
      sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax",
    },
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/auth", authRouter);

io.on("connect", (socket) => {});
server.listen(4000, () => console.log("listening on port 4000"));
