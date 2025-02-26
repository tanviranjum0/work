const { kafka } = require("./client");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.setPrompt("> ");
rl.prompt();

async function init() {
  const producer = kafka.producer();
  console.log("Connecting producer");
  await producer.connect();
  console.log("Producer connected");
  rl.on("line", async (line) => {
    const [riderName, location] = line.split(" ");
    await producer.send({
      topic: "rider-update",
      messages: [
        {
          partition: location.toLowerCase() === "north" ? 0 : 1,
          value: JSON.stringify({
            name: riderName,
            location: location,
          }),
        },
      ],
    });
  }).on("close", async () => {
    await producer.disconnect();
  });
}

init();
