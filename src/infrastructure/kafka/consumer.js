import { Kafka } from "kafkajs";

export const kafkaConsumer = (config, callback) => {
  const kafka = new Kafka({
    clientId: config.clientId,
    brokers: config.brokers
  });

  const consumer = kafka.consumer({ groupId: "logs-group" });

  return {
    async start(topic) {
      await consumer.connect();
      await consumer.subscribe({ topic });

      await consumer.run({
        eachMessage: async ({ message }) => {
          const data = JSON.parse(message.value.toString());
          await callback(data);
        }
      });
    }
  };
};
