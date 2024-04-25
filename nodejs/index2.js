// const http = require("http");
// const fs = require("fs");
const express = require("express");
// const url = require("url");
const app = express();
app.get("/", (req, res) => {
  return res.send("Hello from home page");
});
app.get("/about", (req, res) => {
  return res.send("Hello from About page");
});
app.get("/signup", (req, res) => {
  return res.send(
    "Hello from SignUp page " +
      " hey " +
      " " +
      req.query.name +
      "You are " +
      " " +
      req.query.age
  );
});
function myHandler(req, res) {
  if (req.url === "/favicon.ico") return res.end();
  // console.log(req);
  const log = `${Date.now()}:${req.method}:${req.url} : Request Recieved\n`;
  const myUrl = url.parse(req.url);
  console.log(myUrl);
  fs.appendFile("log.txt", log, (err, data) => {
    switch (myUrl.pathname) {
      case "/":
        if (req.method === "GET") res.end("Homepage");
        break;
      case "/about":
        res.end("Hello From About");
        break;

      case "/signup":
        if (req.method === "GET") res.end("This is a signup form");
        else if (req.method === "POST") res.end("Success");
        break;

      default:
        res.end("Hello From 404");
    }
  });
}
// const myServer = http.createServer(app);
// myServer.listen(8080, () => {
//   console.log("Server Started");
// });

app.listen(1234, () => console.log("server started at : 1234"));
