import express from 'express';
import { MongooseService } from '../services/mongoose';
import { sessionMiddleware, roleMiddleware } from '../middleware';
import { IEmployeeRole } from '../models';

export class OrderController {
    private static instance?: OrderController;

    static getInstance(): OrderController {
        if (!OrderController.instance) {
            OrderController.instance = new OrderController();
        }

        return OrderController.instance;
    }

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

    async findOrders(req: express.Request, res: express.Response): Promise<void> {
        const mongooseService = await MongooseService.getInstance();
        const orderService = mongooseService.orderService;
        const orders = await orderService.findOrders();
        res.json(orders);
    }

    async findOrdersByUserId(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.user_id) {
            res.status(400).end();
            return;
        }

        const mongooseService = await MongooseService.getInstance();
        const orderService = mongooseService.orderService;
        const orders = await orderService.findOrdersByUserId(req.params.user_id);
        res.json(orders);
    }

    async findOrdersByRestaurantId(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.restaurant_id) {
            res.status(400).end();
            return;
        }

        const mongooseService = await MongooseService.getInstance();
        const orderService = mongooseService.orderService;
        const orders = await orderService.findOrdersByRestaurantId(req.params.restaurant_id);
        res.json(orders);
    }

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

    async addProductToOrder(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.order_id || !req.params.product_id) {
            res.status(400).end();
            return;
        }

        const mongooseService = await MongooseService.getInstance();
        const orderService = mongooseService.orderService;
        const order = await orderService.addProductToOrder(req.params.order_id, req.params.product_id);
        res.json(order);
    }

    async removeProductFromOrder(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.order_id || !req.params.product_id) {
            res.status(400).end();
            return;
        }

        const mongooseService = await MongooseService.getInstance();
        const orderService = mongooseService.orderService;
        const order = await orderService.removeProductFromOrder(req.params.order_id, req.params.product_id);
        res.json(order);
    }

    async updateOrder(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.order_id || !req.body) {
            res.status(400).end();
            return;
        }

        const mongooseService = await MongooseService.getInstance();
        const orderService = mongooseService.orderService;
        const order = await orderService.updateOrder(req.params.order_id, req.body);
        res.json(order);
    }

    buildRouter(): express.Router {
        const router = express.Router();
        router.get('/order:id',
            express.json(),
            this.findOrderById);
        router.get('/orders',
            express.json(),
            this.findOrders);
        router.get('/orders/user:id',
            express.json(),
            this.findOrdersByUserId);
        router.get('/orders/restaurant:id',
            express.json(),
            this.findOrdersByRestaurantId);
        router.post('/',
            express.json(),
            sessionMiddleware(),
            this.createOrder);
        router.put('/order:id',
            express.json(),
            sessionMiddleware(),
            this.updateOrder);
        router.post('/order:id/product:id',
            express.json(),
            sessionMiddleware(),
            this.addProductToOrder);
        router.patch('/order:id/product:id',
            express.json(),
            sessionMiddleware(),
            this.removeProductFromOrder);
        router.delete('/order:id',
            sessionMiddleware(),
            roleMiddleware(IEmployeeRole.ADMIN || IEmployeeRole.MANAGER),
            this.deleteOrderById);
        return router;
    }
}