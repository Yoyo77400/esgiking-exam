import { ITimestamp } from "./index";

export interface IPromotion extends ITimestamp {
    _id: string;
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
    startDate: Date;
    endDate: Date;
    conditions?: string;
}