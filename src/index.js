import express from "express";
import mongoose from "mongoose";

import config from "./config/index.js";

import MongoUserLogRepository from "./infrastructure/persistence/mongoUserLogRepository.js";
import UserActivityService from "./application/userActivityService.js";

import UserActivityController from "./interfaces/http/controllers/userActivityController.js";
import userActivityRoutes from "./interfaces/http/routes/userActivityRoutes.js";

const app = express();
app.use(express.json());

await mongoose.connect(config.mongoUrl);

const repository = new MongoUserLogRepository();
const service = new UserActivityService(repository);
const controller = new UserActivityController(service);

app.use("/logs", userActivityRoutes(controller));

app.listen(config.port, () => {
  console.log("Server running on port", config.port);
});
