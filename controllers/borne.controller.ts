import express from 'express';
import { MongooseService } from '../services/mongoose';
import { sessionMiddleware, roleMiddleware } from '../middleware';
import { IEmployeeRole } from '../models';

export class BorneController {
    private static instance?: BorneController;

    static getInstance(): BorneController {
        if (!BorneController.instance) {
            BorneController.instance = new BorneController();
        }

        return BorneController.instance;
    }

    async createBorne(req: express.Request, res: express.Response): Promise<void> {
        if(!req.body || typeof req.body.name !== "string" ) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const borneService = mongooseService.borneService;
        const borne = await borneService.createBorne(req.body);
        res.json(borne);
    }

    async getBorne(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.id) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const borneService = mongooseService.borneService;
        const borne = await borneService.findBorneById(req.params.id);
        if (!borne) {
            res.status(404).end();
            return;
        }
        res.json(borne);
    }

    async deleteBorne(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.id) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const borneService = mongooseService.borneService;
        const borne = await borneService.deleteBorneById(req.params.id);
        if (!borne) {
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
            roleMiddleware(([IEmployeeRole.ADMIN, IEmployeeRole.MANAGER])), 
            this.createBorne);
        router.get('/borne:id',
            express.json(),
            this.getBorne);
        router.delete('/borne:id', 
            sessionMiddleware(), 
            roleMiddleware([IEmployeeRole.ADMIN || IEmployeeRole.MANAGER]), 
            this.deleteBorne);
        return router;
    }
}