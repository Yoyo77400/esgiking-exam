import { ITimestamp, IAddress } from './index';

export interface IUser extends ITimestamp {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address?: IAddress;
}
