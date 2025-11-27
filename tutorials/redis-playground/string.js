const client = require("./client");
async function init() {
  // await client.set("message:5", "new msg");
  // await client.expire("message:5", 10);
  const result = await client.get("message:5");

  console.log("Result", result);
}
init();
