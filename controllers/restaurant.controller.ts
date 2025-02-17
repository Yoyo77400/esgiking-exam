import express from 'express';
import { MongooseService } from '../services/mongoose';
import { sessionMiddleware, roleMiddleware } from '../middleware';
import { IEmployeeRole } from '../models';


export class RestaurantController {
    private static instance?: RestaurantController;

    static getInstance(): RestaurantController {
        if (!RestaurantController.instance) {
            RestaurantController.instance = new RestaurantController();
        }

        return RestaurantController.instance;
    }

    async createReastaurant(req: express.Request, res: express.Response): Promise<void> {
        if(!req.body || typeof req.body.name !== "string" ) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const restaurantService = mongooseService.restaurantService;
        const restaurant = await restaurantService.createRestaurant(req.body);
        res.json(restaurant);
    }

    buildRouter(): express.Router {
        const router = express.Router();
        router.post('/', 
            sessionMiddleware(),
            express.json(), 
            roleMiddleware(IEmployeeRole.ADMIN), 
            this.createReastaurant.bind(this));
        return router;
    }
}