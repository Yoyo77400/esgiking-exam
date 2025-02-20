import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './services/swagger';
import { config } from 'dotenv';
import {MongooseService} from './services';
import {IEmployeeRole} from './models';
import {
  AuthController, 
  MenuController, 
  ProductController, 
  RestaurantController, 
  CategoryController, 
  OrderController,
  DeliveyController,
  EmployeeController,
  TrackerController,
  PromotionController,

} from './controllers';
import { SecurityUtils } from './utils/security.utils';

config();

function launchAPI() {
  const app = express();

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  app.use('/auth', AuthController.getInstance().buildRouter());
  app.use('/menus', MenuController.getInstance().buildRouter());
  app.use('/products', ProductController.getInstance().buildRouter());
  app.use('/restaurants', RestaurantController.getInstance().buildRouter());
  app.use('/categories', CategoryController.getInstance().buildRouter());
  app.use('/orders', OrderController.getInstance().buildRouter());
  app.use('/deliveries', DeliveyController.getInstance().buildRouter());
  app.use('/employees', EmployeeController.getInstance().buildRouter());
  app.use('/trackers', TrackerController.getInstance().buildRouter());
  app.use('/promotions', PromotionController.getInstance().buildRouter());
  
  app.listen(process.env.PORT || 3000, () => {
    console.log('Le serveur est bien lancé sur le port 3000');
  });
}

async function setupAPI(): Promise<void> {
  const mongooseService = await MongooseService.getInstance();
  const employeeService = mongooseService.employeeService;
  const rootUser = await employeeService.findEmployeeByEmail('root@esgiking.fr');
  const password = "employee";
  if (!rootUser) {
    await employeeService.createEmployee({
      email: 'root@esgiking.fr',
      password: SecurityUtils.sha256(password),
      firstName: 'employee',
      lastName: 'employee',
      role: IEmployeeRole.ADMIN
    });
  }
}

async function main() {
  await setupAPI();
  launchAPI();
}

main().catch(console.error);