import { IProduct } from './product.interface';
import { IPromotion } from './promotion.interface';

export interface IMenu {
  _id: string;
  name: string;
  description: string;
  products: IProduct[];
  promotion?: IPromotion;
}