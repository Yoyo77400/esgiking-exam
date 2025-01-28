import { ITimestamp, IAddress } from './index';

export enum IUserRole {
  CUSTOEER = 'customer',
  ADMIN = 'admin',
  PREPARATOR = 'preparator',
  BIGBOSS = 'bigboss',
}

export interface IUser extends ITimestamp {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: IUserRole;
  address?: IAddress;
}
