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

      // الاشتراك في التوبك — fromBeginning = false يعني يبدأ من أحدث رسالة
      await consumer.subscribe({ topic, fromBeginning: false });

      await consumer.run({
        eachMessage: async ({ message }) => {
          let data;

          try {
            // parsing آمن
            data = JSON.parse(message.value.toString());
          } catch (err) {
            console.error("❌ Failed to parse Kafka message:", err);
            console.error("Raw message value:", message.value.toString());
            return; // skip the message
          }

          try {
            await callback(data);
          } catch (err) {
            console.error("❌ Error while processing message callback:", err);
          }
        },
      });
    },
  };
};
