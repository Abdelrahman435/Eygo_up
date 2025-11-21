export default class UserActivityController {
  constructor(service) {
    this.service = service;
  }

  logActivity = async (req, res) => {
    try {
      const result = await this.service.logActivity(req.body);
      res.json(result);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  };

  getActivities = async (req, res) => {
    const result = await this.service.getActivities(req.query);
    res.json(result);
  };
}
