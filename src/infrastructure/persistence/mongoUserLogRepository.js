import mongoose from "mongoose";
import { UserActivityRepositoryInterface } from "../../domains/userActivity/repositoryInterface.js";

const UserLogSchema = new mongoose.Schema({
  userId: String,
  action: String,
  timestamp: Date
});

const UserLogModel = mongoose.model("UserLog", UserLogSchema);

export default class MongoUserLogRepository extends UserActivityRepositoryInterface {
  static Model = UserLogModel;
}
