import { ITimestamp, IOrder, IEmployee, ICustomer, IChat, IRestaurant } from './index';

export enum BorneStatus {
  DISABLE = 'disable',
  FUNCTIONAL = 'functional',
  ERROR = 'error',
  MAINTENANCE = 'maintenance',
}


export interface IBorne extends ITimestamp {
  _id: string;
  restaurant: IRestaurant;
  status: BorneStatus;
}
