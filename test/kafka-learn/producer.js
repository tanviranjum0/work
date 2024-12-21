const { kafka } = require("./client");
async function init() {
  const producer = kafka.producer();
  console.log("Connecting producer");
  await producer.connect();
  console.log("Producer connected");
  await producer.send({
    topic: "rider-update",
    messages: [
      {
        key: "key1",
        value: JSON.stringify({
          name: "Tanvir",
          location: "Chittagong",
        }),
      },
    ],
  });
  await producer.disconnect();
}

init();
