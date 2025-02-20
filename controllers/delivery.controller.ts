import express from 'express';
import { MongooseService } from '../services';
import { sessionMiddleware } from '../middleware';
import { IEmployeeRole, ICustomer } from '../models';

export class DeliveyController {
    private static instance?: DeliveyController;

    static getInstance(): DeliveyController {
        if (!DeliveyController.instance) {
            DeliveyController.instance = new DeliveyController();
        }
        return DeliveyController.instance;
    }

    async createDelivery(req: express.Request, res: express.Response): Promise<void> {
        if(!req.body || typeof req.body.address !== "string" || typeof req.body.order !== "string" || typeof req.body.status !== "string" || typeof req.body.employee !== "string" || typeof req.body.customer !== "string" || typeof req.body.chat !== "string" || typeof req.body.estimated_delivery !== "string") {
            res.status(400).end();
            return;
        }
        console.log(req.body);
        const mongooseService = await MongooseService.getInstance();
        const deliveryService = mongooseService.deliveryService;
        const delivery = await deliveryService.createDelivery(req.body);
        res.json(delivery);
    }

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

    buildRouter(): express.Router {
        const router = express.Router();
        router.post('/createDelivery', express.json(), this.createDelivery.bind(this));
        router.get('/findDeliveryById/:id',express.json(), this.findDeliveryById.bind(this));
        return router;
    }

}
    

