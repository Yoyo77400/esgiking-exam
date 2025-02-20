import { MongooseService } from "./mongoose.service";
import { Model, isValidObjectId } from "mongoose";
import { Models } from "./mongoose.models";
import { IDelivery, DeliveryStatus } from "../../models";
import { DeliverySchema } from "./schema";

export class DeliveryService {
    readonly mongooseService: MongooseService;
    readonly deliveryModel: Model<IDelivery>;

    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.deliveryModel = this.mongooseService.mongoose.model(Models.Delivery, DeliverySchema);
    }

    async createDelivery(delivery: IDelivery): Promise<IDelivery> {
        return this.deliveryModel.create(delivery);
    }

    async findDeliveryById(id: string): Promise<IDelivery | null> {
        if(!isValidObjectId(id)) {
            return Promise.resolve(null);
        }
        return this.deliveryModel.findById(id);
    }

    async deleteDeliveryById(id: string): Promise<IDelivery | null> {
        if(!isValidObjectId(id)) {
            return Promise.resolve(null);
        }
        return this.deliveryModel.findByIdAndDelete(id);
    }

    async updateDeliveryStatus(id: string, status: DeliveryStatus): Promise<IDelivery | null> {
        if(!isValidObjectId(id)) {
            return Promise.resolve(null);
        }
        return this.deliveryModel.findByIdAndUpdate(id, { status }, { new: true });
    }

    async updateDeliveryEmployee(id: string, employee_id: string): Promise<IDelivery | null> {
        if(!isValidObjectId(id) || !isValidObjectId(employee_id)) {
            return Promise.resolve(null);
        }
        return this.deliveryModel.findByIdAndUpdate(id, { employee: employee_id }, { new: true });
    }

    async updateDeliveryChat(id: string, chat_id: string): Promise<IDelivery | null> {
        if(!isValidObjectId(id) || !isValidObjectId(chat_id)) {
            return Promise.resolve(null);
        }
        return this.deliveryModel.findByIdAndUpdate(id, { chat: chat_id }, { new: true });
    }

    async updateDeliveryEstimatedDelivery(id: string, estimated_delivery: Date): Promise<IDelivery | null> {
        if(!isValidObjectId(id)) {
            return Promise.resolve(null);
        }
        return this.deliveryModel.findByIdAndUpdate(id, { estimated_delivery }, { new: true });
    }

    async updateDeliveryActualDelivery(id: string, actual_delivery: Date): Promise<IDelivery | null> {
        if(!isValidObjectId(id)) {
            return Promise.resolve(null);
        }
        return this.deliveryModel.findByIdAndUpdate(id, { actual_delivery }, { new: true });
    }

    async updateDeliveryOrder(id: string, order_id: string): Promise<IDelivery | null> {
        if(!isValidObjectId(id) || !isValidObjectId(order_id)) {
            return Promise.resolve(null);
        }
        return this.deliveryModel.findByIdAndUpdate(id, { order: order_id }, { new: true });
    }
}