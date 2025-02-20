import { MongooseService } from "./mongoose.service";
import { Model, isValidObjectId } from "mongoose";
import { Models } from "./mongoose.models";
import { ICustomer, IUser } from "../../models";
import { CustomerSchema, UserSchema } from "./schema";
import { ICreateUser } from "./user.service";

export type ICreateCustomer = Omit<ICustomer, "_id">;

export class CustomerService {
    
    readonly mongooseService: MongooseService;
    readonly customerModel: Model<ICustomer>;

    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.customerModel = this.mongooseService.mongoose.model(Models.Customer, CustomerSchema);
    }

    async createCustomer(userId: String, customer: ICreateCustomer): Promise<ICustomer> {
        return this.customerModel.create({orders: [],  user: userId});
    }

    async findCustomerById(id: string): Promise<ICustomer | null> {
        if(!isValidObjectId(id)) {
            return Promise.resolve(null);
        }
        return this.customerModel.findById(id);
    }

    async deleteCustomerById(id: string): Promise<ICustomer | null> {
        if(!isValidObjectId(id)) {
            return Promise.resolve(null);
        }
        return this.customerModel.findByIdAndDelete(id);
    }

    async updateCustomerSession(id: string, session: string): Promise<ICustomer | null> {
        return this.customerModel.findByIdAndUpdate(id, {session}, {new: true}).populate('session');
    }

    async findCustomerByUserId(userId: string): Promise<ICustomer | null> {
        return this.customerModel.findOne({ user: userId });
    }

    async updateCustomerOrders(id: string, orders: string[]): Promise<ICustomer | null> {
        if(!isValidObjectId(id)) {
            return Promise.resolve(null);
        }
        return this.customerModel.findByIdAndUpdate(id, { orders }, { new: true });
    }


    async findCustomerByEmail(email: string): Promise<ICustomer | null> {
        if(!email) {
            return Promise.resolve(null);
        }
        return this.customerModel.findOne({ email });
    }
}
