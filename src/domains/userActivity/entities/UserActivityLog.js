export default class UserActivityLog {
  constructor({ userId, action, timestamp }) {
    this.userId = userId;
    this.action = action;
    this.timestamp = timestamp || new Date();
  }
}
