const { kafka } = require("./client");

async function init() {
  const consumer = kafka.consumer({
    groupId: "my-group",
  });
  await consumer.connect();
  await consumer.subscribe({ topic: "rider-update", fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      console.log(
        `[${topic}] partition: ${partition}`,
        message.value.toString()
      );
    },
  });
}

init();
