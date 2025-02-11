import express from 'express';
import { config } from 'dotenv';
import {MongooseService} from './services';
import {UserRole} from './models';

config();

function launchAPI() {
  const app = express();

  app.listen(process.env.PORT || 3000, () => {
    console.log('API launched on port 3000');
  });
}

async function setupAPI(): Promise<void> {
  const mongooseService = await MongooseService.getInstance();
  const userService = mongooseService.userService;
  const employeeService = mongooseService.employeeService;
  const rootUser = await userService.findUserByEmail('root@root.fr');
  if (!rootUser) {
    const user = await userService.createUser({
      email: 'root@root.fr',
      password: 'root',
      firstName: 'root',
      lastName: 'root',
    });

    const rootEmployee = await employeeService.findEmployeeByEmail('root@root.fr');
    if (!rootEmployee) {
      await employeeService.createEmployee({
        user: user,
        role: UserRole.ADMIN
      });
    }
  }
}

async function main() {
  await setupAPI();
  launchAPI();
}

main().catch(console.error);