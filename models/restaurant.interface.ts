import { ITimestamp, IEmployee, IAddress } from './index';

export interface IRestaurant extends ITimestamp {
  _id: string;
  name: string;
  responsable: IEmployee;
  telephone?: string;
  address: IAddress;
  description?: string;
  employees: IEmployee[];
}
