//External Error
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

// internal imports
const loginRouter = require("./router/loginRouter");
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");

dotenv.config();

//Database Connection

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log("Mongo Connection Successful");
  })
  .catch((err) => {
    console.log(err);
  });

//request Parser

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Set view Engine

app.set("view engine", "ejs");

//Set static Folder

app.use(express.static(path.join(__dirname, "public")));

//Parse cookie

app.use(cookieParser(process.env.COOKIE_PARSER));

//Routing Setup
app.use("/", loginRouter);
// app.use("/users", usersRouter);
// app.use("/inbox", inboxRouter);
//Error Handling

//404 Not-Found handler

app.use(notFoundHandler);

//common error

app.use(errorHandler);

//ServerStarting

app.listen(process.env.PORT, () => {
  console.log(`Server started at PORT ${process.env.PORT}`);
});
