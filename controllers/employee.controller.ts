import express from 'express';
import { MongooseService } from '../services/mongoose';
import { sessionMiddleware, roleMiddleware } from '../middleware';
import { IEmployeeRole } from '../models';

export class EmployeeController {
    private static instance?: EmployeeController;

    static getInstance(): EmployeeController {
        if (!EmployeeController.instance) {
            EmployeeController.instance = new EmployeeController();
        }

        return EmployeeController.instance;
    }

    async createEmployee(req: express.Request, res: express.Response): Promise<void> {

        if(!req.body || typeof req.body.name !== "string" ) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const employeeService = mongooseService.employeeService;
        const employee = await employeeService.createEmployee(req.body);
        res.json(employee);
    }

    buildRouter(): express.Router {
        const router = express.Router();
        router.post('/', 
            sessionMiddleware(),
            express.json(), 
            roleMiddleware(IEmployeeRole.ADMIN), 
            this.createEmployee.bind(this));
        return router;
    }
}