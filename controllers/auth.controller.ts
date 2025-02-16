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

        const mongooseService = await MongooseService.getInstance();
        const userService = mongooseService.employeeService;
        const validEmployee = await userService.findValidEmployee(req.body.email, req.body.password);
        if (!validEmployee) {
            res.status(401).end();
            return;
        }
        const sessionService = mongooseService.sessionService;
        const session = await sessionService.createSession({employee: validEmployee});
        res.json({session: session._id});
    }

    async me (req: express.Request, res: express.Response): Promise<void> {
        res.json(req.employee);
    }

    buildRouter(): express.Router {
        const router = express.Router();
        router.post('/login', express.json(), this.login.bind(this));
        router.get('/me',express.json(), this.me.bind(this));
        return router;
    }
}