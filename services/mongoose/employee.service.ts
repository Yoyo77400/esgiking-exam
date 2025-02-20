import { IEmployee } from '../../models';
import { MongooseService } from './mongoose.service';
import { Model } from 'mongoose';
import { EmployeeSchema } from './schema';
import { Models } from './mongoose.models';
import { SecurityUtils } from '../../utils/security.utils';

export type ICreateEmployee = Omit<IEmployee, '_id' | 'createdAt' | 'updatedAt' | 'session' | 'deliveries' | 'user' | 'orders' | 'tracker'>;

export class EmployeeService {
  readonly mongooseService: MongooseService;
  readonly employeeModel: Model<IEmployee>;

  constructor(mongooseService: MongooseService) {
    this.mongooseService = mongooseService;
    this.employeeModel = this.mongooseService.mongoose.model(Models.Employee, EmployeeSchema);
  }

  async createEmployee(userID: String, employee: ICreateEmployee): Promise<IEmployee> { 
    return this.employeeModel.create({user: userID, ...employee});
  }

  async findEmployeeByEmail(email: string): Promise<IEmployee | null> {
    const user = await this.mongooseService.userService.findUserByEmail(email);
    return this.employeeModel.findOne({user: user?._id}).populate('user');
  }

  async findEmployeeByUserID(userID: string): Promise<IEmployee | null> {
    return this.employeeModel.findOne({user: userID}).populate('user');
  }

  async deleteEmployeeByEmail(email: string): Promise<IEmployee | null> {
    console.log("delete employee by email", email);
    return this.employeeModel.findOneAndDelete({ email: email });
  }

  async findValidEmployee(email: string, password: string): Promise<IEmployee | null> {
    const encryptedPassword = SecurityUtils.sha256(password);
    const test = await this.employeeModel.findOne({ email: email, password: encryptedPassword });
    return test;
  }

  async updateEmployeeSession(id: string, session: string): Promise<IEmployee | null> {
    return this.employeeModel.findByIdAndUpdate(id, {session}).populate('session');
  }
}
