import { ITimestamp, IEmployee } from './index';

export interface ITracker extends ITimestamp {
  _id: string;
  longitude: number;
  latitude: number;
  employee: IEmployee;
}
