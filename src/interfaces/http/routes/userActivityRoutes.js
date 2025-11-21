import { Router } from "express";

export default (controller) => {
  const router = Router();

  router.post("/", controller.logActivity);
  router.get("/", controller.getActivities);

  return router;
};
