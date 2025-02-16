import express from 'express';
import { MongooseService } from '../services/mongoose';
import { sessionMiddleware, roleMiddleware } from '../middleware';
import { IEmployeeRole } from '../models';

export class ProductController {
    private static instance?: ProductController;

    static getInstance(): ProductController {
        if (!ProductController.instance) {
            ProductController.instance = new ProductController();
        }

        return ProductController.instance;
    }

    async createProduct(req: express.Request, res: express.Response): Promise<void> {
        if(!req.body || typeof req.body.name !== "string" ) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const productService = mongooseService.productService; 
        const product = await productService.createProduct(req.body);
        res.json(product);
    }

    buildRouter(): express.Router {
        const router = express.Router();
        router.post('/', 
            sessionMiddleware(),
            express.json(), 
            roleMiddleware([IEmployeeRole.ADMIN]), 
            this.createProduct.bind(this));
        return router;
    }
}