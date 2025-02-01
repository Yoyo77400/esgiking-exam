import { IUser } from '../../models';
import { MongooseService } from './mongoose.service';
import { Model } from 'mongoose';
import { UserSchema } from './schema';
import { Models } from './mongoose.models';
import { SecurityUtils } from '../../utils/security.utils';

export type ICreateUser = Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>;

export class UserService {
  readonly mongooseService: MongooseService;
  readonly userModel: Model<IUser>;

  constructor(mongooseService: MongooseService) {
    this.mongooseService = mongooseService;
    this.userModel = this.mongooseService.mongoose.model(Models.User, UserSchema);
  }

  async createUser(user: ICreateUser): Promise<IUser> {
    return this.userModel.create(user);
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return this.userModel.findOne({ email: email });
  }

  async findValidUser(email: string, password: string): Promise<IUser | null> {
    const encryptedPassword = SecurityUtils.sha256(password);
    return this.userModel.findOne({ email: email, password: encryptedPassword });
  }
}
