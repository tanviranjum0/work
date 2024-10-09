const client = require("./client");

async function init() {
  await client.lpush("message", "hello world");
  await client.lpush("message", "hello ");
  await client.lpush("message", "hello Tanvir");
  // const result = await client.rpop("message");
  // console.log(result);
}
init();
