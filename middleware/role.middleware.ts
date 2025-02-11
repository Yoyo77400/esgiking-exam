import express from "express";
import {UserRole} from "../models";

export function roleMiddleware(role: UserRole): express.RequestHandler {

    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if(req.employee && req.employee.role === role) {
            next();
            return;
        }
        res.status(403).end();
    }
}
