import UserActivityLog from "../domains/userActivity/entities/UserActivityLog.js";
import { validateUserActivity } from "../domains/userActivity/services/validateUserActivity.js";

export default class UserActivityService {
  constructor(repository) {
    this.repository = repository;
  }

  async logActivity(data) {
    validateUserActivity(data);
    const entity = new UserActivityLog(data);
    return await this.repository.save(entity);
  }

  async getActivities(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;

    const filter = {};
    if (query.userId) filter.userId = query.userId;
    if (query.action) filter.action = query.action;

    if (query.from || query.to) {
      filter.timestamp = {};
      if (query.from) filter.timestamp.$gte = new Date(query.from);
      if (query.to) filter.timestamp.$lte = new Date(query.to);
    }

    const options = {
      page,
      limit,
      sort: { timestamp: "desc" }
    };

    return await this.repository.find(filter, options);
  }
}
