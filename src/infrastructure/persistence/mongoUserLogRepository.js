import mongoose from "mongoose";
import { UserActivityRepositoryInterface } from "../../domains/userActivity/repositoryInterface.js";

const UserLogSchema = new mongoose.Schema({
  userId: { type: String, index: true },
  action: String,
  timestamp: { type: Date, index: true }
});

UserLogSchema.index({ userId: 1, timestamp: -1 });

const UserLogModel = mongoose.model("UserLog", UserLogSchema);

export default class MongoUserLogRepository extends UserActivityRepositoryInterface {
  static Model = UserLogModel;
}
