import { IProduct } from './product.interface';

export interface IMenu {
  _id: string;
  name: string;
  description: string;
  products: IProduct[];
}