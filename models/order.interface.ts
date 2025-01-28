import { ITimestamp, IProduct, IAddress } from "./index";

export enum IOrderStatus {
    PENDING = "pending",
    PREPARING = "preparing",
    ACCEPTED = "accepted",
    CANCELLED = "cancelled",
    DELIVERED = "delivered"
}

export interface IOrder extends ITimestamp {
    _id: string;
    customer: string;
    products: IProduct[];
    status: IOrderStatus;
    isDelivery: boolean;
    address?: IAddress;
}