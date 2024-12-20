const { Kafka } = require("kafkajs");
exports.kafka = new Kafka({
  clientId: "kafka-learn",
  brokers: ["192.168.0.109:9092"],
});
