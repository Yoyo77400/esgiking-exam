import {
  ITimestamp,
  IProduct,
  IMenu,
  IUser,
  IEmployee,
  IPromotion,
} from "./index";

// Enum pour les statuts de commande
export enum IOrderStatus {
  PENDING = "pending",
  PREPARING = "preparing",
  ACCEPTED = "accepted",
  CANCELLED = "cancelled",
  DELIVERED = "delivered",
}

// Interface pour les articles de la commande
export interface IOrderItem {
  type: "PRODUCT" | "MENU";
  item: IProduct | IMenu;
  quantity: number;
}

// Interface pour la commande
export interface IOrder extends ITimestamp {
  _id: string;
  user: IUser;
  promotion?: IPromotion;
  items: IOrderItem[];
  preparator: IEmployee;
  deliveryMan: IEmployee;
  menu: IMenu;
  status: IOrderStatus;
}
