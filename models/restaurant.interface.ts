import { ITimestamp } from './index';

export interface IRestaurant extends ITimestamp {
  _id: string;
  name: string;
  description: string;
  admin?: string;
}
