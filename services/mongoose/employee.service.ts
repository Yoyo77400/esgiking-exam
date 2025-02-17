import { IEmployee } from '../../models';
import { MongooseService } from './mongoose.service';
import { Model } from 'mongoose';
import { EmployeeSchema } from './schema';
import { Models } from './mongoose.models';
import { SecurityUtils } from '../../utils/security.utils';

export type ICreateEmployee = Omit<IEmployee, '_id' | 'createdAt' | 'updatedAt' | 'session' | 'deliveries' | 'restaurant' | 'orders' | 'tracker'>;

export class EmployeeService {
  readonly mongooseService: MongooseService;
  readonly employeeModel: Model<IEmployee>;

  constructor(mongooseService: MongooseService) {
    this.mongooseService = mongooseService;
    this.employeeModel = this.mongooseService.mongoose.model(Models.Employee, EmployeeSchema);
  }

  async createEmployee(employee: ICreateEmployee): Promise<IEmployee> {
    console.log("create employee", employee);    
    return this.employeeModel.create(employee);
  }

  async findEmployeeByEmail(email: string): Promise<IEmployee | null> {
    console.log("find employee by email", email);
    return this.employeeModel.findOne({ email: email });
  }

  async findValidEmployee(email: string, password: string): Promise<IEmployee | null> {
    console.log("find valid employee", email, password);
    const encryptedPassword = SecurityUtils.sha256(password);
    console.log("encrypted password", encryptedPassword);
    const test = await this.employeeModel.findOne({ email: email, password: encryptedPassword });
    console.log("test", test);
    return test;
  }
}
