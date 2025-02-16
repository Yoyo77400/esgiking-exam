import { ITimestamp, IUser, IDelivery, IRestaurant, IOrder, ITracker, ISession } from './index';

export enum IEmployeeRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  PREPARER = 'preparer',
  DELIVERYMAN = 'deliveryman',
}

export interface IEmployee extends ITimestamp, IUser {
  _id: string;
  role: IEmployeeRole;
  // user: IUser;
  deliveries?: IDelivery[];
  restaurant?: IRestaurant;
  orders?: IOrder[];
  tracker?: ITracker;
  session?: ISession;
}

