const client = require("./index.js");

async function init() {
  // await client.set("message:6", "attractive");
  await client.expire("message:6", 5);
  // const result = await client.get("message:6");
  // console.log(result);
}

init();
