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

    async getMenu(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.id) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const menuService = mongooseService.menuService;
        const menu = await menuService.findMenuById(req.params.id);
        if (!menu) {
            res.status(404).end();
            return;
        }
        res.json(menu);
    }

    async getMenus(req: express.Request, res: express.Response): Promise<void> {
        const mongooseService = await MongooseService.getInstance();
        const menuService = mongooseService.menuService;
        const menus = await menuService.findMenus();
        res.json(menus);
    }

    async addProductToMenu(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.id || !req.body.product_id) {
            res.status(400).end();
            return;
        }
        const mongooseService = await MongooseService.getInstance();
        const menuService = mongooseService.menuService;
        const menu = await menuService.addProductToMenu(req.params.id, req.body.product_id);
        if (!menu) {
            res.status(404).end();
            return;
        }
        res.json(menu);
    }


    async deleteMenu(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.id) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const menuService = mongooseService.menuService;
        const menu = await menuService.deleteMenuById(req.params.id);
        if (!menu) {
            res.status(404).end();
            return;
        }
        res.status(204).end();
    }

    buildRouter(): express.Router {
        const router = express.Router();
        router.get('/menu:id', 
            express.json(), 
            this.getMenu.bind(this));
        router.get('/',
            express.json(),
            this.getMenus.bind(this));
        router.post('/', 
            express.json(), 
            this.createMenu.bind(this));
        router.post('/menu:id/product',
            sessionMiddleware(),
            roleMiddleware([IEmployeeRole.MANAGER,IEmployeeRole.ADMIN]),
            express.json(),
            this.addProductToMenu.bind(this));
        router.delete('/menu:id',
            sessionMiddleware(),
            roleMiddleware([IEmployeeRole.MANAGER,IEmployeeRole.ADMIN]), 
            this.deleteMenu.bind(this));
        return router;
    }
}