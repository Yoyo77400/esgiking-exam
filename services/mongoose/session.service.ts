import { ISession } from '../../models';
import { MongooseService } from './mongoose.service';
import { Models } from './mongoose.models';
import { Model, isValidObjectId } from 'mongoose';
import { SessionSchema } from './schema/index';

export type ICreateSession = Omit<ISession, '_id' | 'createdAt' | 'updatedAt'>;

export class SessionService {
  readonly mongooseService: MongooseService;
  readonly sessionModel: Model<ISession>;

  constructor(mongooseService: MongooseService) {
    this.mongooseService = mongooseService;
    this.sessionModel = this.mongooseService.mongoose.model(Models.Session, SessionSchema);
  }

  async createSession(sessionBody: ICreateSession): Promise<ISession> {
     const session = await this.sessionModel.create(sessionBody);
     return session;
  }

  findActiveSession(token: string): Promise<ISession | null> {
    if (!isValidObjectId(token)) {
      return Promise.resolve(null);
    }

    return this.sessionModel.findById(token).populate('user');
  }
}
