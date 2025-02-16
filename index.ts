import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './services/swagger';
import { config } from 'dotenv';
import {MongooseService} from './services';
import {IEmployeeRole} from './models';

config();

function launchAPI() {
  const app = express();

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
  const userService = mongooseService.userService;
  const employeeService = mongooseService.employeeService;
  const rootUser = await userService.findUserByEmail('root@esgiking.fr');
  if (!rootUser) {
    await employeeService.createEmployee({
      email: 'employee@esgiking.fr',
      password: 'employee',
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