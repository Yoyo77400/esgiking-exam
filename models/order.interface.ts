import { ITimestamp, IProduct, IMenu, IAddress } from './index';

export enum IOrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  ACCEPTED = 'accepted',
  CANCELLED = 'cancelled',
  DELIVERED = 'delivered',
}

export interface IOrderItem {
  type: 'PRODUCT' | 'MENU';
  item: IProduct | IMenu;
  quantity: number;
}

export interface IOrder extends ITimestamp {
  _id: string;
  customer: string;
  items: IOrderItem[];
  status: IOrderStatus;
  isDelivery: boolean;
  address?: IAddress;
  totalPrice: number;
}
