import express from "express";
import { MongooseService } from "../services/mongoose";
import { sessionMiddleware, roleMiddleware } from "../middleware";
import { ITracker, IEmployeeRole } from "../models";

export class TrackerController {
  private static instance?: TrackerController;

  static getInstance(): TrackerController {
    if (!TrackerController.instance) {
      TrackerController.instance = new TrackerController();
    }

    return TrackerController.instance;
  }

  async createTracker(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    if (
      !req.body ||
      req.body.longitude == 0 ||
      req.body.latitude == 0 ||
      req.body.employee == 0
    ) {
      res.status(400).end();
      return;
    }

    const mongooseService = await MongooseService.getInstance();
    const trackerService = mongooseService.trackerService;
    const product = await trackerService.createTracker(req.body);
    res.json(product);
  }

  async updateTracker(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    if (
      !req.body.id ||
      !req.body ||
      !req.body.longitude ||
      !req.body.latitude
    ) {
      res.status(400).end();
      return;
    }

    const mongooseService = await MongooseService.getInstance();
    const menuService = mongooseService.trackerService;
    const menu = await menuService.updateTracker(req.body);
    if (!menu) {
      res.status(404).end();
      return;
    }
    res.json(menu);
  }

  async deleteTracker(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    if (!req.params.id) {
      res.status(400).end();
      return;
    }

    const mongooseService = await MongooseService.getInstance();
    const trackerService = mongooseService.trackerService;
    const tracker = await trackerService.deleteTrackerById(req.body.id);
    if (!tracker) {
      res.status(404).end();
      return;
    }
    res.json(tracker);
  }

  async getTrackerByEmployeeId(req: express.Request, res: express.Response) {
    if (!req.body.id) {
      res.status(400).end();
      return;
    }

    const mongooseService = await MongooseService.getInstance();
    const trackerService = mongooseService.trackerService;
    const tracker = await trackerService.findTrackerByEmployeeId(req.body.id);
    if (!tracker) {
      res.status(404).end();
      return;
    }
    res.json(tracker);
  }

  buildRouter(): express.Router {
    const router = express.Router();
    router.get(
      "/tracker",
      sessionMiddleware(),
      roleMiddleware([IEmployeeRole.ADMIN]),
      this.getTrackerByEmployeeId.bind(this)
    );
    router.post(
      "/tracker",
      sessionMiddleware(),
      express.json(),
      roleMiddleware([IEmployeeRole.ADMIN]),
      this.createTracker.bind(this)
    );
    router.patch(
      "/tracker",
      sessionMiddleware(),
      roleMiddleware([IEmployeeRole.ADMIN]),
      this.updateTracker.bind(this)
    );
    router.delete(
      "/tracker:id",
      sessionMiddleware(),
      roleMiddleware([IEmployeeRole.ADMIN]),
      this.deleteTracker.bind(this)
    );
    return router;
  }
}