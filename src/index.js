import express from "express";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";

import config from "./config/index.js";

import MongoUserLogRepository from "./infrastructure/persistence/mongoUserLogRepository.js";
import UserActivityService from "./application/userActivityService.js";

import UserActivityController from "./interfaces/http/controllers/userActivityController.js";
import userActivityRoutes from "./interfaces/http/routes/userActivityRoutes.js";

import { kafkaProducer } from "./infrastructure/kafka/producer.js";
import { kafkaConsumer } from "./infrastructure/kafka/consumer.js";

const app = express();
app.use(express.json());

// Create HTTP server & Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Connect Mongo
await mongoose.connect(config.mongoUrl);

// Init services
const repository = new MongoUserLogRepository();
const service = new UserActivityService(repository);

const producer = kafkaProducer(config.kafka);
await producer.connect();

// Controller
const controller = new UserActivityController(
  service,
  producer,
  config.kafka.userActivityTopic
);

// Routes
app.use("/logs", userActivityRoutes(controller));

// Express server
server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

// Kafka Consumer — now receives io to broadcast events
const consumer = kafkaConsumer(config.kafka, async (data) => {
  try {
    const saved = await service.logActivity(data);

    // 🔥 NEW: Broadcast real-time event
    io.emit("new_log", saved);

  } catch (err) {
    console.error("Failed to process message:", err.message);
  }
});

await consumer.start(config.kafka.userActivityTopic);

console.log(`Kafka Consumer listening on topic: ${config.kafka.userActivityTopic}`);
