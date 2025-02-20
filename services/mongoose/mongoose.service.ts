import { Mongoose, connect } from "mongoose";
import {
  MenuService,
  CategoryService,
  EmployeeService,
  RestaurantService,
  ProductService,
  UserService,
  SessionService,
  PromotionService,
  TrackerService,
  OrderService,
  ChatService,
} from "./index";

export class MongooseService {
  private static instance?: MongooseService;
  public mongoose: Mongoose;
  public restaurantService: RestaurantService;
  public productService: ProductService;
  public userService: UserService;
  public sessionService: SessionService;
  public employeeService: EmployeeService;
  public categoryService: CategoryService;
  public menuService: MenuService;
  public promotionService: PromotionService;
  public trackerService: TrackerService;
  public orderService: OrderService;
  public chatService: ChatService;

  private constructor(mongoose: Mongoose) {
    this.mongoose = mongoose;
    this.restaurantService = new RestaurantService(this);
    this.productService = new ProductService(this);
    this.userService = new UserService(this);
    this.sessionService = new SessionService(this);
    this.employeeService = new EmployeeService(this);
    this.categoryService = new CategoryService(this);
    this.menuService = new MenuService(this);
    this.promotionService = new PromotionService(this);
    this.trackerService = new TrackerService(this);
    this.orderService = new OrderService(this);
    this.chatService = new ChatService(this);
  }

  public static async getInstance(): Promise<MongooseService> {
    if (!MongooseService.instance) {
      const connection = await MongooseService.openConnection();
      MongooseService.instance = new MongooseService(connection);
    }
    return MongooseService.instance;
  }

  private static openConnection(): Promise<Mongoose> {
    return connect(process.env.MONGO_URI! as string, {
      auth: {
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD,
      },
      authSource: "admin",
      dbName: process.env.MONGO_DATABASE as string,
    });
  }
}
