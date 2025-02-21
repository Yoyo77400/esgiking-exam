import { ITimestamp, IPromotion, IProduct } from './index';

export interface ICategory extends ITimestamp {
  _id: string;
  name: string;
  description: string;
  promotion?: IPromotion;
  products?: IProduct[];
}
