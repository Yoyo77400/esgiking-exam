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

    async getEmployee(req: express.Request, res: express.Response): Promise<void> {
        if(!req.params.email) {
            res.status(400).end();
            return;
        }
        
        const mongooseService = await MongooseService.getInstance();
        const employeeService = mongooseService.employeeService;
        const employee = await employeeService.findEmployeeByEmail(req.params.email);
        if (!employee) {
            res.status(404).end();
            return;
        }
        res.json(employee);
    }

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
        router.get('/employee:email', 
            express.json(),
            sessionMiddleware(),
            roleMiddleware(IEmployeeRole.ADMIN),
            this.getEmployee.bind(this));
        router.delete('/employee:email',
            sessionMiddleware(),
            roleMiddleware(IEmployeeRole.ADMIN), 
            this.deleteEmployee.bind(this));
        router.post('/', 
            sessionMiddleware(),
            express.json(), 
            roleMiddleware(IEmployeeRole.ADMIN), 
            this.createEmployee.bind(this));
        return router;
    }
}