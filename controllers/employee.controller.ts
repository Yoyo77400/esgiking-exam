import express from 'express';
import { MongooseService } from '../services/mongoose';
import { sessionMiddleware, roleMiddleware } from '../middleware';
import { IEmployeeRole } from '../models';

/**
 * @swagger
 * /employees:
 *   post:
 *     tags:
 *       - Employees
 *     summary: Create a new employee
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - employee
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   email: { type: string }
 *                   password: { type: string }
 *               employee:
 *                 type: object
 *                 properties:
 *                   name: { type: string }
 *                   role: { type: string, enum: [ADMIN, DELIVERYMAN] }
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
export class EmployeeController {
    private static instance?: EmployeeController;

    static getInstance(): EmployeeController {
        if (!EmployeeController.instance) {
            EmployeeController.instance = new EmployeeController();
        }

        return EmployeeController.instance;
    }

    /**
     * @swagger
     * /employees:
     *   post:
     *     tags:
     *       - Employees
     *     summary: Create a new employee
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - user
     *               - employee
     *             properties:
     *               user:
     *                 type: object
     *                 properties:
     *                   email: { type: string }
     *                   password: { type: string }
     *               employee:
     *                 type: object
     *                 properties:
     *                   name: { type: string }
     *                   role: { type: string, enum: [ADMIN, DELIVERYMAN] }
     *     responses:
     *       201:
     *         description: Created
     *       400:
     *         description: Bad Request
     */
    async createEmployee(req: express.Request, res: express.Response): Promise<void> {

        if(!req.body.user || !req.body.employee) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const employeeService = mongooseService.employeeService;
        const userService = mongooseService.userService;
        const user = await userService.createUser(req.body.user);
        const employee = await employeeService.createEmployee(user._id, req.body.employee);

        if (employee.role == IEmployeeRole.DELIVERYMAN) {
            const trackerService = mongooseService.trackerService;
            const tracker = await trackerService.createTracker(employee._id);
            await employeeService.addTrackerToEmployee(employee._id, tracker._id );
        }
        
        res.json({employee, user});
    }

    /**
     * @swagger
     * /employees/findEmployee:
     *   get:
     *     tags:
     *       - Employees
     *     summary: Find employee by email
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *             properties:
     *               email:
     *                 type: string
     *     responses:
     *       200:
     *         description: Success
     *       404:
     *         description: Not Found
     *       400:
     *         description: Bad Request
     */
    async getEmployee(req: express.Request, res: express.Response): Promise<void> {
        if(!req.body.email) {
            res.status(400).end();
            return;
        }
        const mongooseService = await MongooseService.getInstance();
        const employeeService = mongooseService.employeeService;
        const employee = await employeeService.findEmployeeByEmail(req.body.email);
        if (!employee) {
            res.status(404).end();
            return;
        }
        res.json(employee);
    }

    /**
     * @swagger
     * /employees/{email}:
     *   delete:
     *     tags:
     *       - Employees
     *     summary: Delete employee by email
     *     parameters:
     *       - in: path
     *         name: email
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       204:
     *         description: No Content
     *       404:
     *         description: Not Found
     *       400:
     *         description: Bad Request
     */
    async deleteEmployee(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.email) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const employeeService = mongooseService.employeeService;
        const employee = await employeeService.deleteEmployeeByEmail(req.params.email);
        if (!employee) {
            res.status(404).end();
            return;
        }
        res.status(204).end();
    }

    buildRouter(): express.Router {
        const router = express.Router();
        router.get('/', 
            express.json(),
            sessionMiddleware(),
            roleMiddleware([IEmployeeRole.ADMIN]),
            this.getEmployee.bind(this));
        router.delete('/employee/:email',
            sessionMiddleware(),
            roleMiddleware([IEmployeeRole.ADMIN]), 
            this.deleteEmployee.bind(this));
        router.post('/', 
            sessionMiddleware(),
            express.json(),
            roleMiddleware([IEmployeeRole.ADMIN]),
            this.createEmployee.bind(this));
        return router;
    }
}