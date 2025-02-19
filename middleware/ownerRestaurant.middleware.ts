import express from 'express';
import { IEmployee, IEmployeeRole, IRestaurant } from '../models';

export default function ownerRestaurantMiddleware(): express.RequestHandler {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if(req.employee?.restaurant?._id === req.body.restaurant_id) {
            next();
            return;
        }
        res.send(403).end();
    }
}
