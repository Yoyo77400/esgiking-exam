import { ITimestamp, IUser, IDelivery, IRestaurant, IOrder, ITracker, ISession } from './index';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  PREPARER = 'preparer',
  DELIVERYMAN = 'deliveryman',
}

export interface IEmployee extends ITimestamp {
  _id: string;
  role: UserRole;
  user: IUser;
  deliveries?: IDelivery[];
  restaurant?: IRestaurant;
  orders?: IOrder[];
  tracker?: ITracker;
  session?: ISession;
}

