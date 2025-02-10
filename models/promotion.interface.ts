import { ITimestamp, IRestaurant, IEmployee } from './index';

// Enum pour le type de promotion
export enum PromotionType {
  DISCOUNT = 'discount',
  OFFER = 'offer',
}

// Interface pour la promotion
export interface IPromotion extends ITimestamp {
  _id: string;
  type: PromotionType;
  value: number;
  restaurant: IRestaurant;
  startAt: Date;
  endAt: Date;
  responsable: IEmployee;
}
