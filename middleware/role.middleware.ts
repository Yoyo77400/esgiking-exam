import express from "express";
import { MongooseService } from "../services";
import {IEmployeeRole} from "../models";

export function roleMiddleware(role: IEmployeeRole): express.RequestHandler {

    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const mongooseService = await MongooseService.getInstance();
        const employeeService = mongooseService.employeeService;
        if(req.user) {
            const employee = await employeeService.findEmployeeByEmail(req.user.email);
            if(employee && employee.role === role) {
            next();
            return;
            }
        }
        res.status(403).end();
    }
}
