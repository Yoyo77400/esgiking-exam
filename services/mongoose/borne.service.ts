import { IBorne } from '../../models';
import { MongooseService } from './mongoose.service';
import { isValidObjectId, Model } from 'mongoose';
import { BorneSchema } from './schema';
import { Models } from './mongoose.models';

export type ICreateBorne = Omit<IBorne, '_id' | 'admin' | 'createdAt' | 'updatedAt'>;

export class RestauranService {
  readonly mongooseService: MongooseService;
  readonly borneModel: Model<IBorne>;

  constructor(mongooseService: MongooseService) {
    this.mongooseService = mongooseService;
    this.borneModel = this.mongooseService.mongoose.model(Models.Borne, BorneSchema);
  }

  async createRestaurant(borne: ICreateBorne): Promise<IBorne> {
    return this.borneModel.create(borne);
  }

  async findRestaurantById(id: string): Promise<IBorne | null> {
    if (!isValidObjectId(id)) {
      return Promise.resolve(null);
    }

    return this.borneModel.findById(id);
  }

  async findRestaurants(): Promise<IBorne[]> {
    return this.borneModel.find({});
  }

  async updateRestaurantAdmin(
    admin_id: string,
    borne_id: string,
  ): Promise<IBorne | null> {
    if (!isValidObjectId(admin_id) || !isValidObjectId(borne_id)) {
      return Promise.resolve(null);
    }

    return this.borneModel.findByIdAndUpdate(borne_id, { admin: admin_id });
  }

  async deleteRestaurantById(id: string): Promise<IBorne | null> {
    if (!isValidObjectId(id)) {
      return Promise.resolve(null);
    }

    return this.borneModel.findByIdAndDelete(id);
  }
}
