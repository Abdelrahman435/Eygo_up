export function validateUserActivity(data) {
  if (!data.userId) throw new Error("userId is required");
  if (!data.action) throw new Error("action is required");
}
