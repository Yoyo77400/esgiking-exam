import { ITimestamp, IOrder, IEmployee, ICustomer, IChat } from './index';

export enum DeliveryStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
}


export interface IDelivery extends ITimestamp {
  _id: string;
  address: string;
  order: IOrder;
  status: DeliveryStatus;
  employee: IEmployee;
  customer: ICustomer;
  chat: IChat;
  estimated_delivery: Date;
  actual_delivery?: Date;
}
