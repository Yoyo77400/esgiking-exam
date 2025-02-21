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

    /**
     * @swagger
     * /promotions:
     *   post:
     *     tags:
     *       - Promotions
     *     summary: Create a new promotion
     *     security:
     *       - sessionAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - description
     *               - discountPercentage
     *               - startDate
     *               - endDate
     *             properties:
     *               name:
     *                 type: string
     *                 example: "Summer Sale"
     *               description:
     *                 type: string
     *                 example: "Get 20% off on all summer items"
     *               discountPercentage:
     *                 type: number
     *                 minimum: 0
     *                 maximum: 100
     *                 example: 20
     *               startDate:
     *                 type: string
     *                 format: date-time
     *                 example: "2025-06-01T00:00:00Z"
     *               endDate:
     *                 type: string
     *                 format: date-time
     *                 example: "2025-08-31T23:59:59Z"
     *     responses:
     *       200:
     *         description: Promotion created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 _id:
     *                   type: string
     *                 name:
     *                   type: string
     *                 description:
     *                   type: string
     *                 discountPercentage:
     *                   type: number
     *                 startDate:
     *                   type: string
     *                   format: date-time
     *                 endDate:
     *                   type: string
     *                   format: date-time
     *       400:
     *         description: Bad Request - Invalid input
     *       401:
     *         description: Unauthorized
     */
    async createPromotion(req: express.Request, res: express.Response): Promise<void> {
        if(!req.body) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const promotionService = mongooseService.promotionService;
        const promotion = await promotionService.createPromotion(req.body);
        res.json(promotion);
    }

    /**
     * @swagger
     * /promotions/{id}:
     *   get:
     *     tags:
     *       - Promotions
     *     summary: Get a promotion by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Promotion ID
     *     responses:
     *       200:
     *         description: Promotion found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 _id:
     *                   type: string
     *                 name:
     *                   type: string
     *                 description:
     *                   type: string
     *                 discountPercentage:
     *                   type: number
     *                 startDate:
     *                   type: string
     *                   format: date-time
     *                 endDate:
     *                   type: string
     *                   format: date-time
     *       404:
     *         description: Promotion not found
     *       400:
     *         description: Bad Request - Invalid ID
     */
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

    /**
     * @swagger
     * /promotions/{id}:
     *   delete:
     *     tags:
     *       - Promotions
     *     summary: Delete a promotion
     *     security:
     *       - sessionAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Promotion ID
     *     responses:
     *       204:
     *         description: Promotion deleted successfully
     *       404:
     *         description: Promotion not found
     *       400:
     *         description: Bad Request - Invalid ID
     *       401:
     *         description: Unauthorized
     */
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
            roleMiddleware([IEmployeeRole.ADMIN, IEmployeeRole.MANAGER]), 
            this.createPromotion.bind(this));
        router.get('/:id',
            this.getPromotion.bind(this));
        router.delete('/:id', 
            sessionMiddleware(), 
            roleMiddleware([IEmployeeRole.ADMIN, IEmployeeRole.MANAGER]), 
            this.deletePromotion.bind(this));
        return router;
    }
}