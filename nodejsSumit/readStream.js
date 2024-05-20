const http = require("http");
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.write("<html><head><title>Hello</title></head></html>");
    res.write(
      '<body><form method="post" action="/process"><input name="Message" /></form></body>'
    );
    res.end();
  } else if (req.url === "/process" && req.method === "POST") {
    // console.log(req.data);
    const body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      res.end(parsedBody);
    });
    res.write("Thank you for submitting");
    res.end();
  } else {
    res.write("Homepage");
    res.end();
  }
});
server.listen(8080);
console.log("Hello world");
