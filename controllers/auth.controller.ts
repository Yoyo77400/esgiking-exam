import express from 'express';
import { MongooseService } from '../services';
import { sessionMiddleware } from '../middleware';

export class AuthController {
    private static instance?: AuthController;

    static getInstance(): AuthController {
        if (!AuthController.instance) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
    }

    async login(req: express.Request, res: express.Response): Promise<void> {
        if(!req.body || typeof req.body.email !== "string" || typeof req.body.password !== "string") {
            res.status(400).end();
            return;
        }
        console.log(req.body);
        const mongooseService = await MongooseService.getInstance();
        const userService = mongooseService.userService;
        const validUser = await userService.findValidUser(req.body.email, req.body.password);
        console.log(validUser);
        if (!validUser) {
            res.status(401).end();
            return;
        }
        const employeeService = mongooseService.employeeService;
        const employee = await employeeService.findEmployeeByUserID(validUser._id);

        const customerService = mongooseService.customerService;
        const customer = await customerService.findCustomerByUserId(validUser._id);

        const sessionService = mongooseService.sessionService;
        const session = await sessionService.createSession({user: validUser});

        if(customer) {
            await customerService.updateCustomerSession(customer._id, session._id);
        }
        if(employee) {
            await employeeService.updateEmployeeSession(employee._id, session._id);
        }

        res.json({session: session._id});
    }

    async me (req: express.Request, res: express.Response): Promise<void> {
        res.json(req.user);
    }

    buildRouter(): express.Router {
        const router = express.Router();
        router.post('/login', express.json(), this.login.bind(this));
        router.get('/me', sessionMiddleware(), this.me.bind(this));
        return router;
    }
}