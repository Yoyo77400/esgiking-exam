import { ITimestamp, IMenu, IPromotion, ICategory } from './index';

export interface IProduct extends ITimestamp {
  _id: string;
  name: string;
  description: string;
  price: number;
  menu?: IMenu;
  promotion?: IPromotion;
  category: ICategory;
}
