import express from 'express';
import { MongooseService, TrackerService } from '../services';
import { sessionMiddleware, roleMiddleware } from '../middleware';
import { IEmployeeRole, DeliveryStatus } from '../models';

/**
 * @swagger
 * components:
 *   schemas:
 *     Delivery:
 *       type: object
 *       required:
 *         - address
 *         - order
 *         - status
 *         - employee
 *         - customer
 *         - estimated_delivery
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated delivery ID
 *         address:
 *           type: string
 *           description: Delivery address
 *         order:
 *           type: string
 *           description: Reference to the order ID
 *         status:
 *           type: string
 *           enum: [PENDING, ACCEPTED, IN_PROGRESS, DELIVERED, CANCELLED]
 *           description: Current status of the delivery
 *         employee:
 *           type: string
 *           description: ID of the assigned delivery employee
 *         customer:
 *           type: string
 *           description: ID of the customer
 *         chat:
 *           type: string
 *           description: ID of the associated chat
 *         estimated_delivery:
 *           type: string
 *           format: date-time
 *           description: Estimated delivery time
 *         actual_delivery:
 *           type: string
 *           format: date-time
 *           description: Actual delivery time
 * 
 * tags:
 *   name: Deliveries
 *   description: Delivery management endpoints
 */
export class DeliveryController {
    private static instance?: DeliveryController;

    static getInstance(): DeliveryController {
        if (!DeliveryController.instance) {
            DeliveryController.instance = new DeliveryController();
        }
        return DeliveryController.instance;
    }

    /**
     * @swagger
     * /deliveries:
     *   post:
     *     tags: [Deliveries]
     *     summary: Create a new delivery
     *     security:
     *       - sessionAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Delivery'
     *     responses:
     *       200:
     *         description: Delivery created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Delivery'
     *       400:
     *         description: Invalid request body
     *       401:
     *         description: Unauthorized
     */
    async createDelivery(req: express.Request, res: express.Response): Promise<void> {
        if(!req.body || !req.body.address || !req.body.order || !req.body.status || 
           !req.body.employee || !req.body.customer || !req.body.estimated_delivery) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const deliveryService = mongooseService.deliveryService;
        const delivery = await deliveryService.createDelivery(req.body);
        res.json(delivery);
    }

    /**
     * @swagger
     * /deliveries/{id}:
     *   get:
     *     tags: [Deliveries]
     *     summary: Get a delivery by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Delivery ID
     *     responses:
     *       200:
     *         description: Delivery found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Delivery'
     *       404:
     *         description: Delivery not found
     */
    async findDeliveryById(req: express.Request, res: express.Response): Promise<void> {
        const mongooseService = await MongooseService.getInstance();
        const deliveryService = mongooseService.deliveryService;
        const delivery = await deliveryService.findDeliveryById(req.params.id);
        if (!delivery) {
            res.status(404).end();
            return;
        }
        res.json(delivery);
    }

    /**
     * @swagger
     * /deliveries/{id}/restaurant/{restaurant_id}/closest:
     *   post:
     *     tags: [Deliveries]
     *     summary: Assign the closest available delivery person to a delivery
     *     description: Finds the nearest delivery person with READY status based on their current location and assigns them to the delivery
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the delivery to assign a delivery person to
     *       - in: path
     *         name: restaurant_id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the restaurant to find closest delivery person from
     *     responses:
     *       200:
     *         description: Delivery person assigned successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Delivery'
     *       400:
     *         description: Invalid delivery ID or restaurant ID
     *       404:
     *         description: Delivery, restaurant, or available delivery person not found
     */
    async assignDeliveryPersonToDelivery(req: express.Request, res: express.Response): Promise<void> {
        if (!req.params.restaurant_id || !req.params.id) {
            res.status(400).json({ error: 'Restaurant ID is required' });
            return;
        }

        const mongooseService = await MongooseService.getInstance();
        const trackerService = mongooseService.trackerService;
        const restaurantService = mongooseService.restaurantService;
        const deliveryService = mongooseService.deliveryService;

        const restaurant = await restaurantService.findRestaurantById(req.params.restaurant_id);
        if (!restaurant) {
            res.status(404).json({ error: 'Restaurant not found' });
            return;
        }
        const delivery = await trackerService.findNearestTracker({
            latitude: restaurant.address.latitude,
            longitude: restaurant.address.longitude
        });
        
        if (!delivery) {
            res.status(404).json({ error: 'No available delivery person found' });
            return;
        }

        const updatedDelivery = await deliveryService.updateDeliveryEmployee(req.params.id, delivery.employee_id.toString());
        if (!updatedDelivery) {
            res.status(404).end();
            return;
        }
        
        res.json(updatedDelivery);
    }

    /**
     * @swagger
     * /deliveries/{id}/status:
     *   patch:
     *     tags: [Deliveries]
     *     summary: Update delivery status
     *     security:
     *       - sessionAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Delivery ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - status
     *             properties:
     *               status:
     *                 type: string
     *                 enum: [PENDING, ACCEPTED, IN_PROGRESS, DELIVERED, CANCELLED]
     *     responses:
     *       200:
     *         description: Status updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Delivery'
     *       400:
     *         description: Invalid status
     *       404:
     *         description: Delivery not found
     */
    async updateDeliveryStatus(req: express.Request, res: express.Response): Promise<void> {
        if (!req.body.status || !Object.values(DeliveryStatus).includes(req.body.status)) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const deliveryService = mongooseService.deliveryService;
        const delivery = await deliveryService.updateDeliveryStatus(req.params.id, req.body.status);
        if (!delivery) {
            res.status(404).end();
            return;
        }
        res.json(delivery);
    }

    /**
     * @swagger
     * /deliveries/{id}/employee:
     *   patch:
     *     tags: [Deliveries]
     *     summary: Assign employee to delivery
     *     security:
     *       - sessionAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Delivery ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - employee_id
     *             properties:
     *               employee_id:
     *                 type: string
     *     responses:
     *       200:
     *         description: Employee assigned successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Delivery'
     *       400:
     *         description: Invalid employee ID
     *       404:
     *         description: Delivery not found
     */
    async updateDeliveryEmployee(req: express.Request, res: express.Response): Promise<void> {
        if (!req.body.employee_id) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const deliveryService = mongooseService.deliveryService;
        const delivery = await deliveryService.updateDeliveryEmployee(req.params.id, req.body.employee_id);
        if (!delivery) {
            res.status(404).end();
            return;
        }
        res.json(delivery);
    }

    /**
     * @swagger
     * /deliveries/{id}/estimated-delivery:
     *   patch:
     *     tags: [Deliveries]
     *     summary: Update estimated delivery time
     *     security:
     *       - sessionAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Delivery ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - estimated_delivery
     *             properties:
     *               estimated_delivery:
     *                 type: string
     *                 format: date-time
     *     responses:
     *       200:
     *         description: Estimated delivery time updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Delivery'
     *       400:
     *         description: Invalid date format
     *       404:
     *         description: Delivery not found
     */
    async updateEstimatedDelivery(req: express.Request, res: express.Response): Promise<void> {
        if (!req.body.estimated_delivery) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const deliveryService = mongooseService.deliveryService;
        const delivery = await deliveryService.updateDeliveryEstimatedDelivery(req.params.id, new Date(req.body.estimated_delivery));
        if (!delivery) {
            res.status(404).end();
            return;
        }
        res.json(delivery);
    }

    /**
     * @swagger
     * /deliveries/{id}/actual-delivery:
     *   patch:
     *     tags: [Deliveries]
     *     summary: Set actual delivery time
     *     security:
     *       - sessionAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Delivery ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - actual_delivery
     *             properties:
     *               actual_delivery:
     *                 type: string
     *                 format: date-time
     *     responses:
     *       200:
     *         description: Actual delivery time set successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Delivery'
     *       400:
     *         description: Invalid date format
     *       404:
     *         description: Delivery not found
     */
    async updateActualDelivery(req: express.Request, res: express.Response): Promise<void> {
        if (!req.body.actual_delivery) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const deliveryService = mongooseService.deliveryService;
        const delivery = await deliveryService.updateDeliveryActualDelivery(req.params.id, new Date(req.body.actual_delivery));
        if (!delivery) {
            res.status(404).end();
            return;
        }
        res.json(delivery);
    }

    buildRouter(): express.Router {
        const router = express.Router();
        router.post('/', 
            sessionMiddleware(),
            express.json(), 
            roleMiddleware([IEmployeeRole.ADMIN, IEmployeeRole.MANAGER]),
            this.createDelivery.bind(this));
        router.get('/:id', 
            this.findDeliveryById.bind(this));
        router.post('/:id/restaurant/:restaurant_id/closest', 
            this.assignDeliveryPersonToDelivery.bind(this));
        router.patch('/:id/status',
            sessionMiddleware(),
            express.json(),
            roleMiddleware([IEmployeeRole.ADMIN, IEmployeeRole.MANAGER, IEmployeeRole.DELIVERYMAN]),
            this.updateDeliveryStatus.bind(this));
        router.patch('/:id/employee',
            sessionMiddleware(),
            express.json(),
            roleMiddleware([IEmployeeRole.ADMIN, IEmployeeRole.MANAGER]),
            this.updateDeliveryEmployee.bind(this));
        router.patch('/:id/estimated-delivery',
            sessionMiddleware(),
            express.json(),
            roleMiddleware([IEmployeeRole.ADMIN, IEmployeeRole.MANAGER, IEmployeeRole.DELIVERYMAN]),
            this.updateEstimatedDelivery.bind(this));
        router.patch('/:id/actual-delivery',
            sessionMiddleware(),
            express.json(),
            roleMiddleware([IEmployeeRole.ADMIN, IEmployeeRole.MANAGER, IEmployeeRole.DELIVERYMAN]),
            this.updateActualDelivery.bind(this));

        return router;
    }
}
