import { ITimestamp, IUser, IDelivery, IRestaurant, IOrder, ITracker, ISession } from './index';

export interface IEmployee extends ITimestamp {
  _id: string;
  role: string;
  user: IUser;
  deliveries?: IDelivery[];
  restaurant?: IRestaurant;
  orders?: IOrder[];
  tracker?: ITracker;
  session?: ISession;
}

