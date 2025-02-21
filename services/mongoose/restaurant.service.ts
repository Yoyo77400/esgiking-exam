import { IRestaurant } from '../../models';
import { MongooseService } from './mongoose.service';
import { isValidObjectId, Model } from 'mongoose';
import { RestaurantSchema } from './schema';
import { Models } from './mongoose.models';

export type ICreateRestaurant = Omit<IRestaurant, '_id' | 'admin' | 'createdAt' | 'updatedAt' | 'address' | 'employees' | 'responsable'>;

export class RestaurantService {
  readonly mongooseService: MongooseService;
  readonly restaurantModel: Model<IRestaurant>;

  constructor(mongooseService: MongooseService) {
    this.mongooseService = mongooseService;
    this.restaurantModel = this.mongooseService.mongoose.model(Models.Restaurant, RestaurantSchema);
  }

  async createRestaurant(responsableId : string, addressId: string, restaurant: ICreateRestaurant): Promise<IRestaurant> {
    return (await this.restaurantModel.create({ responsable: responsableId, address: addressId, employees : [], ...restaurant}));
  }

  async findRestaurantById(id: string): Promise<IRestaurant | null> {
    if (!isValidObjectId(id)) {
      return Promise.resolve(null);
    }

    return this.restaurantModel.findById(id);
  }

  async addEmployeeToRestaurant(restaurant_id: string, employee_id: string): Promise<IRestaurant | null> {
    if (!isValidObjectId(restaurant_id) || !isValidObjectId(employee_id)) {
      return Promise.resolve(null);
    }
    return this.restaurantModel.findByIdAndUpdate(restaurant_id, { $push: { employees: employee_id } }, { new: true });
  }

  async removeEmployeeFromRestaurant(restaurant_id: string, employee_id: string): Promise<IRestaurant | null> {
    if (!isValidObjectId(restaurant_id) || !isValidObjectId(employee_id)) {
      return Promise.resolve(null);
    }
    return this.restaurantModel.findByIdAndUpdate(restaurant_id, { $pull: { employees: employee_id } }, { new: true });
  }

  async findRestaurants(): Promise<IRestaurant[]> {
    return this.restaurantModel.find({}).populate('responsable').populate('address').populate('employees');
  }

  async updateRestaurantAdmin(
    admin_id: string,
    restaurant_id: string,
  ): Promise<IRestaurant | null> {
    if (!isValidObjectId(admin_id) || !isValidObjectId(restaurant_id)) {
      return Promise.resolve(null);
    }

    return this.restaurantModel.findByIdAndUpdate(restaurant_id, { admin: admin_id });
  }

  async deleteRestaurantById(id: string): Promise<IRestaurant | null> {
    if (!isValidObjectId(id)) {
      return Promise.resolve(null);
    }

    return this.restaurantModel.findByIdAndDelete(id);
  }
}
