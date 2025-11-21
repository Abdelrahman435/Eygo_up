import { Kafka } from "kafkajs";

export const kafkaProducer = (config) => {
  const kafka = new Kafka({
    clientId: config.clientId,
    brokers: config.brokers
  });

  const producer = kafka.producer();

  return {
    async connect() {
      await producer.connect();
    },

    async send(topic, message) {
      await producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }]
      });
    }
  };
};
