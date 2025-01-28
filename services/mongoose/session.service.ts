import { ISession } from "../../models";
import { MongooseService } from "./mongoose.service";
import { Models } from "./mongoose.models";
import { Model, isValidObjectId } from "mongoose";
import {sessionSchema} from "./schema";

export type ICreateSession = Omit<ISession, "_id" | "createdAt" | "updatedAt">;

export class SessionService {

    readonly mongooseService: MongooseService;
    readonly sessionModel: Model<ISession>;

    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.sessionModel = this.mongooseService.mongoose.model(Models.Session, sessionSchema);
    }

    createSession(session: ICreateSession): Promise<ISession> {
        return this.sessionModel.create(session);
    }

    findActiveSession(token: string) : Promise<ISession | null> {
        if (isValidObjectId(token)) {
            return Promise.resolve(null);
        }

        return this.sessionModel.findById(token).populate('user');
    }

}