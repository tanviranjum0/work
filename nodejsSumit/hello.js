// const School = require("./school");
// const school = new School();
// school.on("bellring", (a) => {
//   console.log(`We need to run because ${a.period} ${a.text}`);
// });
// school.startPeriod();

// const fs = require("fs");
// const ourReadStream = fs.createReadStream(`${__dirname}/bigdata.txt`);
// const ourWriteStream = fs.createWriteStream(`${__dirname}/output.txt`);

// ourReadStream.on("data", (data) => {
//   ourWriteStream.write(data);
// });
// ourReadStream.pipe(ourWriteStream);
// const http = require("http");
// const fs = require("fs");
// const server = http.createServer((req, res) => {
//   const myReadStream = fs.createReadStream(__dirname + "/bigdata.txt", "utf8");
//   myReadStream.pipe(res);
// });
// server.listen(8080);
