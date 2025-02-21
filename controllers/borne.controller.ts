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

    /**
     * @swagger
     * /bornes:
     *   post:
     *     tags:
     *       - Bornes
     *     summary: Create a new borne
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
     *             properties:
     *               name:
     *                 type: string
     *                 example: "Borne 1"
     *     responses:
     *       200:
     *         description: Borne created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 _id:
     *                   type: string
     *                 name:
     *                   type: string
     *       400:
     *         description: Bad Request - Invalid input
     *       401:
     *         description: Unauthorized
     */
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

    /**
     * @swagger
     * /bornes/{id}:
     *   get:
     *     tags:
     *       - Bornes
     *     summary: Get a borne by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Borne ID
     *     responses:
     *       200:
     *         description: Borne found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 _id:
     *                   type: string
     *                 name:
     *                   type: string
     *       404:
     *         description: Borne not found
     *       400:
     *         description: Bad Request - Invalid ID
     */
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

    /**
     * @swagger
     * /bornes/{id}:
     *   delete:
     *     tags:
     *       - Bornes
     *     summary: Delete a borne
     *     security:
     *       - sessionAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Borne ID
     *     responses:
     *       204:
     *         description: Borne deleted successfully
     *       404:
     *         description: Borne not found
     *       400:
     *         description: Bad Request - Invalid ID
     *       401:
     *         description: Unauthorized
     */
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
            roleMiddleware([IEmployeeRole.ADMIN, IEmployeeRole.MANAGER]), 
            this.createBorne.bind(this));
        router.get('/:id',
            this.getBorne.bind(this));
        router.delete('/:id', 
            sessionMiddleware(), 
            roleMiddleware([IEmployeeRole.ADMIN, IEmployeeRole.MANAGER]), 
            this.deleteBorne.bind(this));
        return router;
    }
}