const { kafka } = require("./client");

async function init() {
  const admin = kafka.admin();
  console.log("Admin connecting...");
  admin.connect();
  console.log("Admin connected...");
  console.log("Createing topic...");
  await admin.createTopics({
    topics: [{ topic: "rider-update", numPartitions: 2, replicationFactor: 1 }],
  });
  console.log("Topic created successfully");
  console.log("Disconnecting admin");
  await admin.disconnect();
}
init();
