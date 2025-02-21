import express from 'express';
import { MongooseService } from '../services/mongoose';
import { sessionMiddleware, roleMiddleware } from '../middleware';
import { IEmployeeRole } from '../models';

/**
 * @swagger
 * components:
 *   schemas:
 *     Menu:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated menu ID
 *         name:
 *           type: string
 *           description: Name of the menu
 *         products:
 *           type: array
 *           items:
 *             type: string
 *           description: List of product IDs in this menu
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the menu was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the menu was last updated
 * 
 * tags:
 *   name: Menus
 *   description: Menu management endpoints
 */
export class MenuController {
    private static instance?: MenuController;

    static getInstance(): MenuController {
        if (!MenuController.instance) {
            MenuController.instance = new MenuController();
        }

        return MenuController.instance;
    }

    /**
     * @swagger
     * /menus:
     *   post:
     *     tags: [Menus]
     *     summary: Create a new menu
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *             properties:
     *               name:
     *                 type: string
     *                 description: Menu name
     *               products:
     *                 type: array
     *                 items:
     *                   type: string
     *                 description: Initial list of product IDs
     *     responses:
     *       200:
     *         description: Menu created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Menu'
     *       400:
     *         description: Invalid request body
     */
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

    /**
     * @swagger
     * /menus/{id}:
     *   get:
     *     tags: [Menus]
     *     summary: Get a menu by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Menu ID
     *     responses:
     *       200:
     *         description: Menu found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Menu'
     *       400:
     *         description: Invalid menu ID
     *       404:
     *         description: Menu not found
     */
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

    /**
     * @swagger
     * /menus:
     *   get:
     *     tags: [Menus]
     *     summary: Get all menus
     *     description: Retrieve a list of all available menus
     *     responses:
     *       200:
     *         description: List of menus retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Menu'
     */
    async getMenus(req: express.Request, res: express.Response): Promise<void> {
        const mongooseService = await MongooseService.getInstance();
        const menuService = mongooseService.menuService;
        const menus = await menuService.findMenus();
        res.json(menus);
    }

    /**
     * @swagger
     * /menus/{id}/products:
     *   post:
     *     tags: [Menus]
     *     summary: Add a product to a menu
     *     security:
     *       - sessionAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Menu ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - product_id
     *             properties:
     *               product_id:
     *                 type: string
     *                 description: ID of the product to add
     *     responses:
     *       200:
     *         description: Product added to menu successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Menu'
     *       400:
     *         description: Invalid request parameters
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - Requires MANAGER or ADMIN role
     *       404:
     *         description: Menu not found
     */
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

    async addPromotionToMenu(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.id || !req.body.promotion_id) {
            res.status(400).end();
            return;
        }
        const mongooseService = await MongooseService.getInstance();
        const menuService = mongooseService.menuService;
        const menu = await menuService.addPromotionToMenu(req.params.id, req.body.promotion_id);
        if (!menu) {
            res.status(404).end();
            return;
        }
        res.json(menu);
    }


    /**
     * @swagger
     * /menus/{id}:
     *   delete:
     *     tags: [Menus]
     *     summary: Delete a menu
     *     security:
     *       - sessionAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Menu ID to delete
     *     responses:
     *       204:
     *         description: Menu deleted successfully
     *       400:
     *         description: Invalid menu ID
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - Requires MANAGER or ADMIN role
     *       404:
     *         description: Menu not found
     */
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
        router.get('/:id', 
            this.getMenu.bind(this));
        router.get('/',
            this.getMenus.bind(this));
        router.post('/', 
            express.json(), 
            this.createMenu.bind(this));
        router.post('/:id/products',
            sessionMiddleware(),
            roleMiddleware([IEmployeeRole.MANAGER, IEmployeeRole.ADMIN]),
            express.json(),
            this.addProductToMenu.bind(this));
        router.post('/:id/promotion',
            sessionMiddleware(),
            roleMiddleware([IEmployeeRole.MANAGER, IEmployeeRole.ADMIN]),
            express.json(),
            this.addPromotionToMenu.bind(this));
        router.delete('/:id',
            sessionMiddleware(),
            roleMiddleware([IEmployeeRole.MANAGER, IEmployeeRole.ADMIN]), 
            this.deleteMenu.bind(this));
        return router;
    }
}