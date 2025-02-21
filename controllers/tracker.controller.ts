import express from "express";
import { MongooseService } from "../services/mongoose";
import { sessionMiddleware, roleMiddleware } from "../middleware";
import { ITracker, IEmployeeRole } from "../models";

/**
 * @swagger
 * components:
 *   schemas:
 *     Tracker:
 *       type: object
 *       required:
 *         - longitude
 *         - latitude
 *         - employee
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated tracker ID
 *         longitude:
 *           type: number
 *           description: Longitude coordinate of the tracker
 *         latitude:
 *           type: number
 *           description: Latitude coordinate of the tracker
 *         employee:
 *           type: string
 *           description: ID of the employee being tracked
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the tracker was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the tracker was last updated
 * 
 * tags:
 *   name: Trackers
 *   description: Employee location tracking management
 */
export class TrackerController {
  private static instance?: TrackerController;

  static getInstance(): TrackerController {
    if (!TrackerController.instance) {
      TrackerController.instance = new TrackerController();
    }
    return TrackerController.instance;
  }

  /**
   * @swagger
   * /trackers/tracker:
   *   post:
   *     tags: [Trackers]
   *     summary: Create a new tracker location
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - longitude
   *               - latitude
   *               - employee
   *             properties:
   *               longitude:
   *                 type: number
   *                 description: Longitude coordinate
   *               latitude:
   *                 type: number
   *                 description: Latitude coordinate
   *               employee:
   *                 type: string
   *                 description: Employee ID
   *     responses:
   *       200:
   *         description: Tracker location created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Tracker'
   *       400:
   *         description: Invalid request body
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Requires ADMIN role
   */
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

  /**
   * @swagger
   * /trackers/tracker:
   *   patch:
   *     tags: [Trackers]
   *     summary: Update a tracker location
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id
   *               - longitude
   *               - latitude
   *             properties:
   *               id:
   *                 type: string
   *                 description: Tracker ID to update
   *               longitude:
   *                 type: number
   *                 description: New longitude coordinate
   *               latitude:
   *                 type: number
   *                 description: New latitude coordinate
   *     responses:
   *       200:
   *         description: Tracker location updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Tracker'
   *       400:
   *         description: Invalid request body
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Requires DELIVERYMAN role
   *       404:
   *         description: Tracker not found
   */
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

  /**
   * @swagger
   * /trackers/tracker{id}:
   *   delete:
   *     tags: [Trackers]
   *     summary: Delete a tracker
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Tracker ID to delete
   *     responses:
   *       200:
   *         description: Tracker deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Tracker'
   *       400:
   *         description: Invalid tracker ID
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Requires ADMIN role
   *       404:
   *         description: Tracker not found
   */
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
    const tracker = await trackerService.deleteTrackerById(req.params.id);
    if (!tracker) {
      res.status(404).end();
      return;
    }
    res.json(tracker);
  }

  /**
   * @swagger
   * /trackers/tracker:
   *   get:
   *     tags: [Trackers]
   *     summary: Get tracker by employee ID
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - id
   *             properties:
   *               id:
   *                 type: string
   *                 description: Employee ID to find tracker for
   *     responses:
   *       200:
   *         description: Tracker found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Tracker'
   *       400:
   *         description: Invalid employee ID
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Requires ADMIN role
   *       404:
   *         description: Tracker not found
   */
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
      express.json(),
      roleMiddleware([IEmployeeRole.DELIVERYMAN]),
      this.updateTracker.bind(this)
    );
    router.delete(
      "/tracker/:id",
      sessionMiddleware(),
      roleMiddleware([IEmployeeRole.ADMIN]),
      this.deleteTracker.bind(this)
    );
    return router;
  }
}