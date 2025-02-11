import { ITimestamp, IUser, IEmployee } from './index';

export interface ISession extends ITimestamp {
  _id: string;
  accessToken: string;
  user?: IUser;
  employee?: IEmployee;
}
