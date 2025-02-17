import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './services/swagger';
import { config } from 'dotenv';
import {MongooseService} from './services';
import {IEmployeeRole} from './models';
import {AuthController, MenuController, ProductController, RestaurantController} from './controllers';
import { SecurityUtils } from './utils/security.utils';

config();

function launchAPI() {
  const app = express();

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  app.use('/auth', AuthController.getInstance().buildRouter());
  app.use('/menus', MenuController.getInstance().buildRouter());
  app.use('/products', ProductController.getInstance().buildRouter());
  app.use('/restaurants', RestaurantController.getInstance().buildRouter());

  app.route('/').get((req, res) => {
    res.send('Hello World!');
  });

  app.listen(process.env.PORT || 3000, () => {
    console.log('API launched on port 3000');
    console.log('Swagger docs available at http://localhost:3000/api-docs');
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