import { ITimestamp } from './index';
import { Types } from 'mongoose';

export interface ITracker extends ITimestamp {
  _id: string;
  longitude: number;
  latitude: number;
  employee_id: Types.ObjectId;
}
