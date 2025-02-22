const client = require("./index.js");

async function init() {
  // await client.set("message:4", "Hello from Node js");
  // await client.expire("message:5", 10);

  const result = await client.get("message:5");
  // console.log(result);
}

init();
