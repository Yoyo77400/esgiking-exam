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
    return this.employeeModel.create(employee);
  }

  async findEmployeeByEmail(email: string): Promise<IEmployee | null> {
    return this.employeeModel.findOne({ email: email });
  }

  async findValidEmployee(email: string, password: string): Promise<IEmployee | null> {
    const encryptedPassword = SecurityUtils.sha256(password);
    return this.employeeModel.findOne({ email: email, password: encryptedPassword });
  }
}
