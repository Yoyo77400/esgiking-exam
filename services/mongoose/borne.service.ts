import { IBorne } from '../../models';
import { MongooseService } from './mongoose.service';
import { isValidObjectId, Model } from 'mongoose';
import { BorneSchema } from './schema';
import { Models } from './mongoose.models';

export type ICreateBorne = Omit<IBorne, '_id' | 'admin' | 'createdAt' | 'updatedAt'>;

export class BorneService {
  readonly mongooseService: MongooseService;
  readonly borneModel: Model<IBorne>;

  constructor(mongooseService: MongooseService) {
    this.mongooseService = mongooseService;
    this.borneModel = this.mongooseService.mongoose.model(Models.Borne, BorneSchema);
  }

  async createBorne(borne: ICreateBorne): Promise<IBorne> {
    return this.borneModel.create(borne);
  }

  async findBorneById(id: string): Promise<IBorne | null> {
    if (!isValidObjectId(id)) {
      return Promise.resolve(null);
    }

    return this.borneModel.findById(id);
  }

  async findBornes(): Promise<IBorne[]> {
    return this.borneModel.find({});
  }

  async updateBorneAdmin(
    admin_id: string,
    borne_id: string,
  ): Promise<IBorne | null> {
    if (!isValidObjectId(admin_id) || !isValidObjectId(borne_id)) {
      return Promise.resolve(null);
    }

    return this.borneModel.findByIdAndUpdate(borne_id, { admin: admin_id });
  }

  async deleteBorneById(id: string): Promise<IBorne | null> {
    if (!isValidObjectId(id)) {
      return Promise.resolve(null);
    }

    return this.borneModel.findByIdAndDelete(id);
  }
}
