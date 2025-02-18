import express from 'express';
import { MongooseService } from '../services/mongoose';
import { sessionMiddleware, roleMiddleware } from '../middleware';
import { IEmployeeRole } from '../models';

export class CategoryController {
    private static instance?: CategoryController;

    static getInstance(): CategoryController {
        if (!CategoryController.instance) {
            CategoryController.instance = new CategoryController();
        }

        return CategoryController.instance;
    }

    async createCategory(req: express.Request, res: express.Response): Promise<void> {
        if(!req.body || typeof req.body.name !== "string" ) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const categoryService = mongooseService.categoryService;
        const category = await categoryService.createCategory(req.body);
        res.json(category);
    }

    async getCategory(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.id) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const categoryService = mongooseService.categoryService;
        const category = await categoryService.findCategoryById(req.params.id);
        if (!category) {
            res.status(404).end();
            return;
        }
        res.json(category);
    }

    async deleteCategory(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.id) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const categoryService = mongooseService.categoryService;
        const category = await categoryService.deleteCategoryById(req.params.id);
        if (!category) {
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
            roleMiddleware(IEmployeeRole.MANAGER), 
            this.createCategory);
        router.get('/:id',
            express.json(),
            sessionMiddleware(), 
            roleMiddleware(IEmployeeRole.MANAGER), 
            this.getCategory);
        router.delete('/:id', sessionMiddleware(), 
        roleMiddleware(IEmployeeRole.ADMIN), 
        this.deleteCategory);
        return router;
    }
}