import { ITimestamp } from "./index";

export interface IAddress extends ITimestamp {
    _id: string;
    street: string;
    city: string;
    postalCode: string;
}