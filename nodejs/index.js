const http = require("http");
const fs = require("fs");
const url = require("url");
const myServer = http.createServer((req, res) => {
  if (req.url === "/favicon.ico") {
    return res.end("");
  }
  const log = `${Date.now()}:New : ${req.url.length}:${req.url}\n`;
  const myUrl = url.parse(req.url, true);
  console.log(myUrl);
  fs.appendFile("log.txt", log, (err, data) => {
    if (myUrl.pathname === "/") {
      res.end("Home");
    } else if (myUrl.pathname === "/about") {
      const username = myUrl.query.name;

      res.end(`Hi,I am ${username}`);
    } else if (myUrl.pathname === "/search") {
      const username = myUrl.query.search_query;
      res.end(`Your search result is ${username}`);
    }
    console.log(req.method);
  });
});

myServer.listen(8080, () => console.log("server started"));
// console.log("best");
// console.log(myUrl);
