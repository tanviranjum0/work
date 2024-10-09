const client = require("./client");
async function init() {
  // await client.set("message:4", "new msg");
  // await client.expire("message:4", 10);
  const result = await client.get("message:4");

  console.log("Result", result);
}
init();
