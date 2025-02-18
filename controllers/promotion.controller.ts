import express from 'express';
import { MongooseService } from '../services/mongoose';
import { sessionMiddleware, roleMiddleware } from '../middleware';
import { IEmployeeRole } from '../models';

export class PromotionController {
    private static instance?: PromotionController;

    static getInstance(): PromotionController {
        if (!PromotionController.instance) {
            PromotionController.instance = new PromotionController();
        }

        return PromotionController.instance;
    }

    async createPromotion(req: express.Request, res: express.Response): Promise<void> {
        if(!req.body || typeof req.body.name !== "string" ) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const promotionService = mongooseService.promotionService;
        const promotion = await promotionService.createPromotion(req.body);
        res.json(promotion);
    }

    async getPromotion(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.id) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const promotionService = mongooseService.promotionService;
        const promotion = await promotionService.findPromotionById(req.params.id);
        if (!promotion) {
            res.status(404).end();
            return;
        }
        res.json(promotion);
    }

    async deletePromotion(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.id) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const promotionService = mongooseService.promotionService;
        const promotion = await promotionService.deletePromotionById(req.params.id);
        if (!promotion) {
            res.status(404).end();
            return;
        }
        res.status(204).end();
    }

    buildRouter(): express.Router {
        const router = express.Router();
        router.post('/', 
            express.json(),
            sessionMiddleware(), 
            roleMiddleware(IEmployeeRole.ADMIN || IEmployeeRole.MANAGER), 
            this.createPromotion);
        router.get('/promotion:id',
            express.json(), 
            this.getPromotion);
        router.delete('/promotion:id', 
            sessionMiddleware(), 
            roleMiddleware(IEmployeeRole.ADMIN || IEmployeeRole.MANAGER), 
            this.deletePromotion);
        return router;
    }
}