import { ITimestamp, IPromotion } from "./index";

export interface IProduct extends ITimestamp {
    _id: string;
    name: string;
    description: string;
    price: number;
    composition: string[];
    promotions?: IPromotion[];
}