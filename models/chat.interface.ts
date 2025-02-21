import { ITimestamp } from "./index";
import { Types } from "mongoose";

export interface IChat extends ITimestamp {
  _id: string;
  delivery_id: Types.ObjectId;
  message: string;
  is_read: boolean;
}
