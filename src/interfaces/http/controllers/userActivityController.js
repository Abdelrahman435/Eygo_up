import { validateUserActivity } from "../../../domains/userActivity/services/validateUserActivity.js";

export default class UserActivityController {
  constructor(service, producer, topic) {
    this.service = service;
    this.producer = producer;
    this.topic = topic;
  }

  // Instead of saving directly → send to Kafka
  logActivity = async (req, res) => {
    try {
      // validate only (reuse same validator)
      validateUserActivity(req.body);

      // send to Kafka
      await this.producer.send(this.topic, req.body);

      return res.status(202).json({
        status: "accepted",
        message: "Activity queued for processing",
      });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  };

  // Read from MongoDB normally
  getActivities = async (req, res) => {
    try {
      const result = await this.service.getActivities(req.query);
      return res.json(result);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  };
}
