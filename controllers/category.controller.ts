import express from 'express';
import { MongooseService } from '../services/mongoose';
import { sessionMiddleware, roleMiddleware } from '../middleware';
import { IEmployeeRole } from '../models';

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated category ID
 *         name:
 *           type: string
 *           description: Name of the category
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *           description: List of products in this category
 * 
 * tags:
 *   name: Categories
 *   description: Category management endpoints
 */
export class CategoryController {
    private static instance?: CategoryController;

    static getInstance(): CategoryController {
        if (!CategoryController.instance) {
            CategoryController.instance = new CategoryController();
        }
        return CategoryController.instance;
    }

    /**
     * @swagger
     * /categories:
     *   post:
     *     tags: [Categories]
     *     summary: Create a new category
     *     security:
     *       - bearerAuth: []
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
     *                 description: Name of the category
     *     responses:
     *       200:
     *         description: Category created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Category'
     *       400:
     *         description: Invalid request body
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - Requires MANAGER or ADMIN role
     */
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

    /**
     * @swagger
     * /categories/{id}:
     *   get:
     *     tags: [Categories]
     *     summary: Get a category by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Category ID
     *     responses:
     *       200:
     *         description: Category found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Category'
     *       400:
     *         description: Invalid category ID
     *       404:
     *         description: Category not found
     */
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

    /**
     * @swagger
     * /categories/{id}/products:
     *   get:
     *     tags: [Categories]
     *     summary: Get all products in a category
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Category ID
     *     responses:
     *       200:
     *         description: List of products in the category
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Product'
     *       404:
     *         description: Category not found or no products available
     */
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

    /**
     * @swagger
     * /categories/{id}:
     *   delete:
     *     tags: [Categories]
     *     summary: Delete a category
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Category ID to delete
     *     responses:
     *       204:
     *         description: Category successfully deleted
     *       400:
     *         description: Invalid category ID
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - Requires ADMIN or MANAGER role
     *       404:
     *         description: Category not found
     */
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
        router.get('/:id',
            express.json(),
            this.getCategory);
        router.get('/:id/products',
            express.json(),
            this.getProductsByCategory);
        router.delete('/:id', 
            sessionMiddleware(), 
            roleMiddleware([IEmployeeRole.ADMIN,IEmployeeRole.MANAGER]), 
            this.deleteCategory);
        return router;
    }
}