import { ITimestamp, IDelivery } from "./index";

export interface IChat extends ITimestamp {
  _id: string;
  delivery_id: IDelivery["_id"];
  message: string;
  is_read: boolean;
}
