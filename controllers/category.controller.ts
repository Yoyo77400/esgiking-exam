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

    async getProductsByCategory(req: express.Request, res: express.Response): Promise<void> {
        const mongooseService = await MongooseService.getInstance();
        const categoryService = mongooseService.categoryService;
        const category = await categoryService.findProductsByCategory(req.params.id);
        const products = category?.products;
        if (!products) {
            res.status(404).end();
        }   
        res.json(products);
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
            roleMiddleware([IEmployeeRole.MANAGER,IEmployeeRole.ADMIN]), 
            this.createCategory);
        router.get('/category:id',
            express.json(),
            this.getCategory);
        router.get('/category:id/products',
            express.json(),
            this.getProductsByCategory);
        router.delete('/category:id', 
            sessionMiddleware(), 
            roleMiddleware([IEmployeeRole.ADMIN,IEmployeeRole.MANAGER]), 
            this.deleteCategory);
        return router;
    }
}