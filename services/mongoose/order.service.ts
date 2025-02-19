import { IOrder } from '../../models';
import { MongooseService } from './mongoose.service';
import { isValidObjectId, Model } from 'mongoose';
import { OrderSchema } from './schema';
import { Models } from './mongoose.models';

export type ICreateOrder = Omit<IOrder, '_id' | 'createdAt' | 'updatedAt'>

export class OrderService {
    readonly mongooseService: MongooseService;
    readonly orderModel: Model<IOrder>;

    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.orderModel = this.mongooseService.mongoose.model(Models.Order, OrderSchema);
    }

    async createOrder(order: ICreateOrder): Promise<IOrder> {
        return this.orderModel.create(order);
    }

    async findOrderById(id: string): Promise<IOrder | null> {
        if (!isValidObjectId(id)) {
            return Promise.resolve(null);
        }
        return this.orderModel.findById(id).populate('products');
    }

    async findOrders(): Promise<IOrder[]> {
        return this.orderModel.find({}).populate('products');
    }

    async findOrdersByUserId(user_id: string): Promise<IOrder[] | null> {
        if (!isValidObjectId(user_id)) {
            return Promise.resolve([]);
        }
        return this.orderModel.find({ user: user_id }).populate('products');
    }

    async findOrdersByRestaurantId(restaurant_id: string): Promise<IOrder[] | null> {
        if (!isValidObjectId(restaurant_id)) {
            return Promise.resolve([]);
        }
        return this.orderModel.find({ restaurant: restaurant_id }).populate('products');
    }

    async deleteOrderById(id: string): Promise<IOrder | null> {
        if (!isValidObjectId(id)) {
            return Promise.resolve(null);
        }
        return this.orderModel.findByIdAndDelete(id);
    }

    async addProductToOrder(order_id: string, product_id: string): Promise<IOrder | null> {
        if (!isValidObjectId(order_id) || !isValidObjectId(product_id)) {
            return Promise.resolve(null);
        }
        return this.orderModel.findByIdAndUpdate(order_id, { $addToSet: { products: product_id } }).populate('products');
    }

    async removeProductFromOrder(order_id: string, product_id: string): Promise<IOrder | null> {
        if (!isValidObjectId(order_id) || !isValidObjectId(product_id)) {
            return Promise.resolve(null);
        }
        return this.orderModel.findByIdAndUpdate(order_id, { $pull: { products: product_id } }).populate('products');
    }

    async updateOrder(order_id: string, order: ICreateOrder): Promise<IOrder | null> {
        if (!isValidObjectId(order_id)) {
            return Promise.resolve(null);
        }
        return this.orderModel.findByIdAndUpdate(order_id, order).populate('products');
    }
}