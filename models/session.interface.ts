import { ITimestamp, IUser, IEmployee } from './index';

export interface ISession extends ITimestamp {
  _id: string;
  user?: IUser;
  employee?: IEmployee;
}
