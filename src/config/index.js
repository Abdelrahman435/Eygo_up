import dotenv from "dotenv";
dotenv.config();

export default {
  kafka: {
    clientId: "eyego-service",
    brokers: [process.env.KAFKA_BROKER],
    userActivityTopic: "user-activity"
  },
  mongoUrl: process.env.MONGO_URL,
  port: process.env.PORT || 3000
};
