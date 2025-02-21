import express, { Request } from 'express';
import { MongooseService } from '../services/mongoose';
import { sessionMiddleware, roleMiddleware } from '../middleware';
import { IEmployeeRole } from '../models';
import ownerRestaurantMiddleware from '../middleware/ownerRestaurant.middleware';

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - user
 *         - restaurant
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated order ID
 *         user:
 *           type: string
 *           description: ID of the user who placed the order
 *         restaurant:
 *           type: string
 *           description: ID of the restaurant where the order was placed
 *         products:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of product IDs in the order
 *         status:
 *           type: string
 *           enum: [PENDING, ACCEPTED, IN_PROGRESS, DELIVERED, CANCELLED]
 *           description: Current status of the order
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */
export class OrderController {
    private static instance?: OrderController;

    static getInstance(): OrderController {
        if (!OrderController.instance) {
            OrderController.instance = new OrderController();
        }
        return OrderController.instance;
    }

    /**
     * @swagger
     * /orders:
     *   post:
     *     tags: [Orders]
     *     summary: Create a new order
     *     security:
     *       - sessionAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - user
     *               - restaurant
     *             properties:
     *               user:
     *                 type: string
     *                 description: User ID
     *               restaurant:
     *                 type: string
     *                 description: Restaurant ID
     *               products:
     *                 type: array
     *                 items:
     *                   type: string
     *                 description: Initial list of product IDs
     *     responses:
     *       200:
     *         description: Order created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Order'
     *       400:
     *         description: Invalid request body
     *       401:
     *         description: Unauthorized
     */
    async createOrder(req: express.Request, res: express.Response): Promise<void> {
        if(!req.body || typeof req.body.user !== "string" || typeof req.body.restaurant !== "string") {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const orderService = mongooseService.orderService;
        const order = await orderService.createOrder(req.body);
        res.json(order);
    }

    /**
     * @swagger
     * /orders/{id}:
     *   get:
     *     tags: [Orders]
     *     summary: Get an order by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Order ID
     *     responses:
     *       200:
     *         description: Order found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Order'
     *       400:
     *         description: Invalid order ID
     *       404:
     *         description: Order not found
     */
    async findOrderById(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.id) {
            res.status(400).end();
            return;
        }

        const mongooseService = await MongooseService.getInstance();
        const orderService = mongooseService.orderService;
        const order = await orderService.findOrderById(req.params.id);
        res.json(order);
    }

    /**
     * @swagger
     * /orders:
     *   get:
     *     tags: [Orders]
     *     summary: Get all orders
     *     responses:
     *       200:
     *         description: List of all orders
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Order'
     */
    async findOrders(req: express.Request, res: express.Response): Promise<void> {
        const mongooseService = await MongooseService.getInstance();
        const orderService = mongooseService.orderService;
        const orders = await orderService.findOrders();
        res.json(orders);
    }

    /**
     * @swagger
     * /orders/user/{id}:
     *   get:
     *     tags: [Orders]
     *     summary: Get orders by user ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: User ID
     *     responses:
     *       200:
     *         description: List of orders for the user
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Order'
     *       400:
     *         description: Invalid user ID
     */
    async findOrdersByUserId(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.id) {
            res.status(400).end();
            return;
        }

        const mongooseService = await MongooseService.getInstance();
        const orderService = mongooseService.orderService;
        const orders = await orderService.findOrdersByUserId(req.params.id);
        res.json(orders);
    }

    /**
     * @swagger
     * /orders/restaurant/{id}:
     *   get:
     *     tags: [Orders]
     *     summary: Get orders by restaurant ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Restaurant ID
     *     responses:
     *       200:
     *         description: List of orders for the restaurant
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Order'
     *       400:
     *         description: Invalid restaurant ID
     */
    async findOrdersByRestaurantId(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.id) {
            res.status(400).end();
            return;
        }

        const mongooseService = await MongooseService.getInstance();
        const orderService = mongooseService.orderService;
        const orders = await orderService.findOrdersByRestaurantId(req.params.id);
        res.json(orders);
    }

    /**
     * @swagger
     * /orders/{id}:
     *   delete:
     *     tags: [Orders]
     *     summary: Delete an order
     *     security:
     *       - sessionAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Order ID to delete
     *     responses:
     *       200:
     *         description: Order deleted successfully
     *       400:
     *         description: Invalid order ID
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - Requires ADMIN or MANAGER role and restaurant ownership
     *       404:
     *         description: Order not found
     */
    async deleteOrderById(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.id) {
            res.status(400).end();
            return;
        }

        const mongooseService = await MongooseService.getInstance();
        const orderService = mongooseService.orderService;
        const order = await orderService.deleteOrderById(req.params.id);
        res.json(order);
    }

    /**
     * @swagger
     * /orders/{id}/product/{productId}:
     *   post:
     *     tags: [Orders]
     *     summary: Add a product to an order
     *     security:
     *       - sessionAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Order ID
     *       - in: path
     *         name: productId
     *         required: true
     *         schema:
     *           type: string
     *         description: Product ID to add
     *     responses:
     *       200:
     *         description: Product added to order successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Order'
     *       400:
     *         description: Invalid order ID or product ID
     *       401:
     *         description: Unauthorized
     */
    async addProductToOrder(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.id || !req.params.productId) {
            res.status(400).end();
            return;
        }

        const mongooseService = await MongooseService.getInstance();
        const orderService = mongooseService.orderService;
        const order = await orderService.addProductToOrder(req.params.id, req.params.productId);
        res.json(order);
    }

    /**
     * @swagger
     * /orders/{id}/product/{productId}:
     *   patch:
     *     tags: [Orders]
     *     summary: Remove a product from an order
     *     security:
     *       - sessionAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Order ID
     *       - in: path
     *         name: productId
     *         required: true
     *         schema:
     *           type: string
     *         description: Product ID to remove
     *     responses:
     *       200:
     *         description: Product removed from order successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Order'
     *       400:
     *         description: Invalid order ID or product ID
     *       401:
     *         description: Unauthorized
     */
    async removeProductFromOrder(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.id || !req.params.productId) {
            res.status(400).end();
            return;
        }

        const mongooseService = await MongooseService.getInstance();
        const orderService = mongooseService.orderService;
        const order = await orderService.removeProductFromOrder(req.params.id, req.params.productId);
        res.json(order);
    }

    /**
     * @swagger
     * /orders/{id}:
     *   put:
     *     tags: [Orders]
     *     summary: Update an order
     *     security:
     *       - sessionAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Order ID to update
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               status:
     *                 type: string
     *                 enum: [PENDING, ACCEPTED, IN_PROGRESS, DELIVERED, CANCELLED]
     *                 description: New order status
     *     responses:
     *       200:
     *         description: Order updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Order'
     *       400:
     *         description: Invalid order ID or request body
     *       401:
     *         description: Unauthorized
     */
    async updateOrder(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.id || !req.body) {
            res.status(400).end();
            return;
        }

        const mongooseService = await MongooseService.getInstance();
        const orderService = mongooseService.orderService;
        const order = await orderService.updateOrder(req.params.id, req.body);
        res.json(order);
    }

    buildRouter(): express.Router {
        const router = express.Router();
        
        // Get single order
        router.get('/:id', this.findOrderById.bind(this));
        
        // Get all orders
        router.get('/', this.findOrders.bind(this));
        
        // Get orders by user
        router.get('/user/:id', this.findOrdersByUserId.bind(this));
        
        // Get orders by restaurant
        router.get('/restaurant/:id', this.findOrdersByRestaurantId.bind(this));
        
        // Create order
        router.post('/',
            sessionMiddleware(),
            express.json(),
            this.createOrder.bind(this));
        
        // Update order
        router.put('/:id',
            sessionMiddleware(),
            express.json(),
            this.updateOrder.bind(this));
        
        // Add product to order
        router.post('/:id/product/:productId',
            sessionMiddleware(),
            express.json(),
            this.addProductToOrder.bind(this));
        
        // Remove product from order
        router.patch('/:id/product/:productId',
            sessionMiddleware(),
            express.json(),
            this.removeProductFromOrder.bind(this));
        
        // Delete order
        router.delete('/:id',
            sessionMiddleware(),
            roleMiddleware([IEmployeeRole.ADMIN, IEmployeeRole.MANAGER]),
            ownerRestaurantMiddleware(),
            this.deleteOrderById.bind(this));
            
        return router;
    }
}