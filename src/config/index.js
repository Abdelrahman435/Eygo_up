import dotenv from "dotenv";
dotenv.config();

const rawBrokers = process.env.KAFKA_BROKERS || process.env.KAFKA_BROKER || "localhost:9092";

export default {
  kafka: {
    clientId: "eyego-service",
    brokers: rawBrokers.split(",").map(s => s.trim()),
    userActivityTopic: process.env.KAFKA_TOPIC || "user-activity"
  },
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/EyEgo",
  port: process.env.PORT ? Number(process.env.PORT) : 4000
};
