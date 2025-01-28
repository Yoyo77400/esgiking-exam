import { IRestaurant } from "../../models";
import { MongooseService } from "./mongoose.service";
import { isValidObjectId, Model } from "mongoose";
import { RestaurantSchema} from "./schema";
import { Models } from "./mongoose.models";

export type ICreateRestaurant = Omit<IRestaurant, "_id" | "admin" | "createdAt" | "updatedAt">;

export class RestaurantService {

    readonly mongooseService: MongooseService;
    readonly restaurantModel: Model<IRestaurant>;

    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.restaurantModel = this.mongooseService.mongoose.model(Models.Restaurant, RestaurantSchema);
    }

    async createRestaurant(restaurant: ICreateRestaurant): Promise<IRestaurant> {
        return this.restaurantModel.create(restaurant);
    }

    async findRestaurantById(id: string): Promise<IRestaurant | null> {
        if (!isValidObjectId(id)) {
            return Promise.resolve(null);
        }

        return this.restaurantModel.findById(id);
    }

    async findRestaurants(): Promise<IRestaurant[]> {
        return this.restaurantModel.find({});
    }

    async updateRestaurantAdmin( admin_id: string, restaurant_id: string): Promise<IRestaurant | null> {
        if (!isValidObjectId(admin_id) || !isValidObjectId(restaurant_id)) {
            return Promise.resolve(null);
        }

        return this.restaurantModel.findByIdAndUpdate(
            restaurant_id,
            { admin: admin_id },
        );
    }
    
    async deleteRestaurantById(id: string): Promise<IRestaurant | null> {
        if (!isValidObjectId(id)) {
            return Promise.resolve(null);
        }

        return this.restaurantModel.findByIdAndDelete(id);
    }

}