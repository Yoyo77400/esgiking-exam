import { MongooseService } from "./mongoose.service";
import { Model, isValidObjectId } from "mongoose";
import { Models } from "./mongoose.models";
import { ICustomer, IUser } from "../../models";
import { CustomerSchema, UserSchema } from "./schema";

export type ICreateCustomer = Omit<ICustomer, "_id">;
export class CustomerService {
    
    readonly mongooseService: MongooseService;
    readonly customerModel: Model<ICustomer>;

    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.customerModel = this.mongooseService.mongoose.model(Models.Customer, CustomerSchema);
    }

    async createCustomer(user: IUser, customer: ICreateCustomer): Promise<ICustomer> {
        const User = this.mongooseService.userService.createUser(user);
        return this.customerModel.create({ ...customer, user: User});
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

    async updateCustomerName(id: string, name: string): Promise<ICustomer | null> {
        if(!isValidObjectId(id)) {
            return Promise.resolve(null);
        }
        return this.customerModel.findByIdAndUpdate(id, { name }, { new: true });
    }

    async updateCustomerEmail(id: string, email: string): Promise<ICustomer | null> {
        if(!isValidObjectId(id)) {
            return Promise.resolve(null);
        }
        return this.customerModel.findByIdAndUpdate(id, { email }, { new: true });
    }

    async updateCustomerPhone(id: string, phone: string): Promise<ICustomer | null> {
        if(!isValidObjectId(id)) {
            return Promise.resolve(null);
        }
        return this.customerModel.findByIdAndUpdate(id, { phone }, { new: true });
    }

    async updateCustomerAddress(id: string, address: string): Promise<ICustomer | null> {
        if(!isValidObjectId(id)) {
            return Promise.resolve(null);
        }
        return this.customerModel.findByIdAndUpdate(id, { address }, { new: true });
    }

    async updateCustomerPassword(id: string, password: string): Promise<ICustomer | null> {
        if(!isValidObjectId(id)) {
            return Promise.resolve(null);
        }
        return this.customerModel.findByIdAndUpdate(id, { password }, { new: true });
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
