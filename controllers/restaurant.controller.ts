import express from 'express';
import { MongooseService } from '../services/mongoose';
import { sessionMiddleware, roleMiddleware } from '../middleware';
import { IEmployeeRole } from '../models';

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated restaurant ID
 *         name:
 *           type: string
 *           description: Name of the restaurant
 *         address:
 *           type: string
 *           description: Physical address of the restaurant
 *         phone:
 *           type: string
 *           description: Contact phone number
 *         email:
 *           type: string
 *           format: email
 *           description: Contact email address
 *         openingHours:
 *           type: object
 *           description: Restaurant opening hours
 *         menu:
 *           type: array
 *           items:
 *             type: string
 *           description: List of menu IDs associated with this restaurant
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the restaurant was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the restaurant was last updated
 * 
 *   securitySchemes:
 *     sessionAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *       description: Session token for authentication
 * 
 * tags:
 *   name: Restaurants
 *   description: Restaurant management endpoints
 */
export class RestaurantController {
    private static instance?: RestaurantController;

    static getInstance(): RestaurantController {
        if (!RestaurantController.instance) {
            RestaurantController.instance = new RestaurantController();
        }
        return RestaurantController.instance;
    }

    /**
     * @swagger
     * /restaurants:
     *   post:
     *     tags: [Restaurants]
     *     summary: Create a new restaurant
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
     *                 description: Restaurant name
     *               address:
     *                 type: string
     *                 description: Physical address
     *               phone:
     *                 type: string
     *                 description: Contact phone number
     *               email:
     *                 type: string
     *                 format: email
     *                 description: Contact email
     *               openingHours:
     *                 type: object
     *                 description: Opening hours configuration
     *     responses:
     *       200:
     *         description: Restaurant created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Restaurant'
     *       400:
     *         description: Invalid request body
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - Requires ADMIN role
     */
    async createRestaurant(req: express.Request, res: express.Response): Promise<void> {
        if(!req.body || typeof req.body.name !== "string" ) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const restaurantService = mongooseService.restaurantService;
        const restaurant = await restaurantService.createRestaurant(req.body);
        res.json(restaurant);
    }

    /**
     * @swagger
     * /restaurants:
     *   get:
     *     tags: [Restaurants]
     *     summary: Get all restaurants
     *     description: Retrieve a list of all restaurants
     *     responses:
     *       200:
     *         description: List of restaurants retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Restaurant'
     */
    async getRestaurants(req: express.Request, res: express.Response): Promise<void> {
        const mongooseService = await MongooseService.getInstance();
        const restaurantService = mongooseService.restaurantService;
        const restaurants = await restaurantService.findRestaurants();
        res.json(restaurants);
    }

    /**
     * @swagger
     * /restaurants/{id}:
     *   delete:
     *     tags: [Restaurants]
     *     summary: Delete a restaurant
     *     security:
     *       - sessionAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Restaurant ID to delete
     *     responses:
     *       200:
     *         description: Restaurant deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Restaurant'
     *       400:
     *         description: Invalid restaurant ID
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - Requires ADMIN role
     *       404:
     *         description: Restaurant not found
     */
    async deleteRestaurant(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.id) {
            res.status(400).end();
            return;
        }
        const mongooseService = await MongooseService.getInstance();
        const restaurantService = mongooseService.restaurantService;
        const restaurant = await restaurantService.deleteRestaurantById(req.params.id);
        res.json(restaurant);
    }

    buildRouter(): express.Router {
        const router = express.Router();
        router.get('/', 
            express.json(),
            this.getRestaurants.bind(this));
        router.post('/', 
            sessionMiddleware(),
            express.json(),
            roleMiddleware([IEmployeeRole.ADMIN]), 
            this.createRestaurant.bind(this));
        router.delete('/:id', 
            sessionMiddleware(),
            roleMiddleware([IEmployeeRole.ADMIN]), 
            this.deleteRestaurant.bind(this));
        return router;
    }
}