import { ITimestamp, IUser } from './index';

export interface ISession extends ITimestamp {
  _id: string;
  accessToken: string;
  user: IUser;
}
