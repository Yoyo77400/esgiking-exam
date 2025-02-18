import { IOrder } from '../../models';
import { MongooseService } from './mongoose.service';
import { isValidObjectId, Model } from 'mongoose';
import { OrderSchema } from './schema';
import { Models } from './mongoose.models';

export type IOrder = Omit<IOrder, '_id' | 'createdAt' | 'updatedAt'>
