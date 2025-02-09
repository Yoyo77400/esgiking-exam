import { ITimestamp, IDelivery } from './index';

export interface IChat extends ITimestamp {
  _id: string;
  delivery: IDelivery;
  message: string;
  is_read: boolean;
}
