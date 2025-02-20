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
        if(!req.body || typeof req.body.name !== "string" || typeof req.body.email !== "string" || typeof req.body.phone !== "string" || typeof req.body.address !== "string" || typeof req.body.password !== "string") {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const customerService = mongooseService.customerService;
        const customer = await customerService.createCustomer(req.body.user, req.body.customer);
        res.json(customer);
    }

    buildRoutes(): express.Router {
        const router = express.Router();
        router.post('/createCustomer', express.json(), this.createCustomer.bind(this));
        return router;
    }
}