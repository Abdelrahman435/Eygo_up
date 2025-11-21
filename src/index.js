import express from "express";
import mongoose from "mongoose";

import config from "./config/index.js";

import MongoUserLogRepository from "./infrastructure/persistence/mongoUserLogRepository.js";
import UserActivityService from "./application/userActivityService.js";

import UserActivityController from "./interfaces/http/controllers/userActivityController.js";
import userActivityRoutes from "./interfaces/http/routes/userActivityRoutes.js";

import { kafkaProducer } from "./infrastructure/kafka/producer.js";
import { kafkaConsumer } from "./infrastructure/kafka/consumer.js";

const app = express();
app.use(express.json());

await mongoose.connect(config.mongoUrl);

const repository = new MongoUserLogRepository();
const service = new UserActivityService(repository);

const producer = kafkaProducer(config.kafka);
await producer.connect();

const controller = new UserActivityController(
  service,
  producer,
  config.kafka.userActivityTopic
);

app.use("/logs", userActivityRoutes(controller));

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

const consumer = kafkaConsumer(config.kafka, async (data) => {
  try {
    await service.logActivity(data);
  } catch (err) {
    console.error("Failed to process message:", err.message);
  }
});

await consumer.start(config.kafka.userActivityTopic);

console.log(`Kafka Consumer listening on topic: ${config.kafka.userActivityTopic}`);
