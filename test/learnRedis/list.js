const client = require("./index.js");

async function init() {
  //   await client.lpush("msgs", 1);
  //   await client.lpush("msgs", 2);
  //   await client.lpush("msgs", 3);
  //   const result = await client.blpop("msgs", 10);
  //   console.log(result);

  //   const res1 = await client.hset("bike:1", {
  //     model: "Deimos",
  //     brand: "Ergonom",
  //     type: "Enduro bikes",
  //     price: 4972,
  //   });
  //   console.log(res1); // 4

  const res2 = await client.hget("bike:1", "model");
  console.log(res2); // 'Deimos'

  const res3 = await client.hget("bike:1", "price");
  console.log(res3); // '4972'

  const res4 = await client.hgetall("bike:1");
  console.log(res4);
  const res5 = await client.hmget("bike:1", ["price", "model"]);
  console.log(res5);
}

init();
