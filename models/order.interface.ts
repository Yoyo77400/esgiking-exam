import { ITimestamp, IProduct, IMenu, ICustomer, IEmployee, IPromotion, IRestaurant } from './index';

// Enum pour les statuts de commande
export enum IOrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  ACCEPTED = 'accepted',
  CANCELLED = 'cancelled',
  DELIVERED = 'delivered',
}

// Interface pour les articles de la commande
export interface IOrderItem {
  type: 'PRODUCT' | 'MENU';
  item: IProduct | IMenu;
  quantity: number;
}

// Interface pour la commande
export interface IOrder extends ITimestamp {
  _id: string;
  customer: ICustomer;
  promotion?: IPromotion;
  items: IOrderItem[];
  deliveryMan: IEmployee;
  menu: IMenu;
  status: IOrderStatus;
  restaurant: IRestaurant["_id"];
}
