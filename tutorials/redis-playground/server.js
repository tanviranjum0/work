// const express = require("express");
// const axios = require("axios");
// const client = require("./client");

// const app = express();
// app.get("/", async (req, res) => {
//   const cachedValue = await client.get("todos");
//   if (cachedValue) return res.json(cachedValue);
//   const { data } = await axios.get(
//     "https://jsonplaceholder.typicode.com/todos"
//   );
//   await client.set("todos", JSON.stringify(data));
//   await client.expire("todos", 5);
//   return res.json(data);
// });

// app.listen(3000, () => {
//   console.log("server", 3000);
// });
