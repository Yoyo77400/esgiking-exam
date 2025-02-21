import express from 'express';
import { MongooseService } from '../services/mongoose';
import { sessionMiddleware, roleMiddleware } from '../middleware';

export class CustomerController {
    private static instance?: CustomerController;

    static getInstance(): CustomerController {
        if (!CustomerController.instance) {
            CustomerController.instance = new CustomerController();
        }

        return CustomerController.instance;
    }

    /**
     * @swagger
     * /customers:
     *   post:
     *     tags:
     *       - Customers
     *     summary: Create a new customer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - user
     *               - customer
     *             properties:
     *               user:
     *                 type: object
     *                 required:
     *                   - email
     *                   - password
     *                 properties:
     *                   email:
     *                     type: string
     *                     format: email
     *                     example: "customer@example.com"
     *                   password:
     *                     type: string
     *                     format: password
     *                     example: "password123"
     *               customer:
     *                 type: object
     *                 required:
     *                   - name
     *                 properties:
     *                   name:
     *                     type: string
     *                     example: "John Doe"
     *                   address:
     *                     type: string
     *                     example: "123 Main St"
     *                   phone:
     *                     type: string
     *                     example: "+33123456789"
     *     responses:
     *       200:
     *         description: Customer created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 customer:
     *                   type: object
     *                   properties:
     *                     _id:
     *                       type: string
     *                     name:
     *                       type: string
     *                     user_id:
     *                       type: string
     *                 user:
     *                   type: object
     *                   properties:
     *                     _id:
     *                       type: string
     *                     email:
     *                       type: string
     *       400:
     *         description: Bad Request - Invalid input
     */
    async createCustomer(req: express.Request, res: express.Response): Promise<void> {
        const mongooseService = await MongooseService.getInstance();
        const customerService = mongooseService.customerService;
        const userService = mongooseService.userService;
        const user = await userService.createUser(req.body.user);
        const customer = await customerService.createCustomer(user._id, req.body.customer);
        res.json({customer, user});
    }

    buildRouter(): express.Router {
        const router = express.Router();
        router.post('/', express.json(), this.createCustomer.bind(this));
        return router;
    }
}