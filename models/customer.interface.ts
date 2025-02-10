import { ITimestamp, IUser, IOrder, ISession } from './index';

export interface ICustomer extends ITimestamp {
  _id: string;
  user: IUser;
  orders?: IOrder[];
  session?: ISession;
}
