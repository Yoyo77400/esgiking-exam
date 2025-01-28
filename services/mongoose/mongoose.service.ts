import { Mongoose, connect } from "mongoose";
import { RestaurantService } from "./restaurant.service";
import { ProductService } from "./product.service";
import { UserService } from "./user.service";
import { SessionService } from "./session.service";

export class MongooseService {
    private static instance?: MongooseService;
    public mongoose: Mongoose;
    public restaurantService: RestaurantService;
    public productService: ProductService;
    public userService: UserService;
    public sessionService: SessionService;

    private constructor(mongoose: Mongoose) {
        this.mongoose = mongoose;
        this.restaurantService = new RestaurantService(this);
        this.productService = new ProductService(this);
        this.userService = new UserService(this);
        this.sessionService = new SessionService(this);
    }
    
    public static async getInstance(): Promise<MongooseService> {
        if (!MongooseService.instance) {
            const connection = await MongooseService.openConnection();
            MongooseService.instance = new MongooseService(connection);
        }
        return MongooseService.instance;
    }

    private static openConnection() : Promise<Mongoose> {
        return connect(process.env.MONGO_URI! as string, {
            auth: {
                username: process.env.MONGO_USERNAME,
                password: process.env.MONGO_PASSWORD
            },
            authSource: 'admin',
            dbName: process.env.MONGO_DATABASE as string
        })
    }
}