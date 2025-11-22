import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
  clientId: "test-client",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "test-group" });

const run = async () => {
  await producer.connect();
  console.log("Producer connected");

  await producer.send({
    topic: "test-topic",
    messages: [{ value: "Hello Kafka" }],
  });
  console.log("Message sent");

  await consumer.connect();
  console.log("Consumer connected");

  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });
  console.log("Consumer subscribed");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value.toString()}`);
    },
  });
};

run().catch(console.error);
