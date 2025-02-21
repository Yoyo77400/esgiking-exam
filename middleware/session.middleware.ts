import express from "express";
import {MongooseService} from "../services";
import {IUser, IEmployee} from "../models";

declare module "express" {
    interface Request {
        employee?: IEmployee;
        user?: IUser;
    }
}

export function sessionMiddleware(): express.RequestHandler {

    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(401).end();
            return;
        }
        // HEADER -> Authorization: Bearer XXXX
        // authorization="Bearer XXXX"
        const parts = authorization.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            res.status(401).end();
            return;
        }
        const token = parts[1];
        const mongooseService = await MongooseService.getInstance();
        const sessionService = mongooseService.sessionService;
        const session = await sessionService.findActiveSession(token);
        if (!session) {
            res.status(401).end();
            return;
        }

        if (session.user) {
            req.user = session.user as IUser;
        }
        
        next();
    };
}