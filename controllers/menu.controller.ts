import express from 'express';
import { MongooseService } from '../services/mongoose';
import { sessionMiddleware, roleMiddleware } from '../middleware';
import { IEmployeeRole } from '../models';

export class MenuController {
    private static instance?: MenuController;

    static getInstance(): MenuController {
        if (!MenuController.instance) {
            MenuController.instance = new MenuController();
        }

        return MenuController.instance;
    }

    async createMenu(req: express.Request, res: express.Response): Promise<void> {
        if(!req.body || typeof req.body.name !== "string" ) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const menuService = mongooseService.menuService;
        const product = await menuService.createMenu(req.body);
        res.json(product);
    }

    buildRouter(): express.Router {
        const router = express.Router();
        router.post('/', 
            sessionMiddleware(),
            express.json(), 
            roleMiddleware(IEmployeeRole.ADMIN), 
            this.createMenu.bind(this));
        return router;
    }
}