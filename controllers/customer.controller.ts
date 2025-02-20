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