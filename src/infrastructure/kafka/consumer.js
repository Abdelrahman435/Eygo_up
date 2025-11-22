import { Kafka } from "kafkajs";

export const kafkaConsumer = (config, callback) => {
  const kafka = new Kafka({
    clientId: config.clientId,
    brokers: config.brokers,
  });

  const consumer = kafka.consumer({ groupId: "logs-group" });

  return {
    async start(topic) {
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: false });

      await consumer.run({
        eachMessage: async ({ message }) => {
          let data;

          try {
            data = JSON.parse(message.value.toString());
          } catch (err) {
            console.error("Failed to parse Kafka message:", err);
            return;
          }

          // callback now handles saving + websocket emitting
          await callback(data);
        },
      });
    },
  };
};
