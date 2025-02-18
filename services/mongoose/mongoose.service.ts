import { Mongoose, connect } from 'mongoose';
import { RestaurantService } from './restaurant.service';
import { ProductService } from './product.service';
import { UserService } from './user.service';
import { SessionService } from './session.service';
import { EmployeeService } from './employee.service';
import { CategoryService } from './category.service';
import { MenuService } from './menu.service';
import { PromotionService } from './promotion.service';

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
      authSource: 'admin',
      dbName: process.env.MONGO_DATABASE as string,
    });
  }
}
