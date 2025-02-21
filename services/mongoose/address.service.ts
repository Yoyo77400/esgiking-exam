import { IAddress } from '../../models';
import { MongooseService } from './mongoose.service';
import { isValidObjectId, Model } from 'mongoose';
import { AddressSchema } from './schema';
import { Models } from './mongoose.models';

export type ICreateAddress = Omit<IAddress, '_id' | 'createdAt' | 'updatedAt'>;

export class AddressService {
  readonly mongooseService: MongooseService;
  readonly addressModel: Model<IAddress>;

  constructor(mongooseService: MongooseService) {
    this.mongooseService = mongooseService;
    this.addressModel = this.mongooseService.mongoose.model(Models.Address, AddressSchema);
  }

  async createAddress(address: ICreateAddress): Promise<IAddress> {
    return this.addressModel.create(address);
  }

  async findAddressById(id: string): Promise<IAddress | null> {
    if (!isValidObjectId(id)) {
      return Promise.resolve(null);
    }

    return this.addressModel.findById(id);
  }

  async findAddresses(): Promise<IAddress[]> {
    return this.addressModel.find({});
  }

  async deleteAddressById(id: string): Promise<IAddress | null> {
    if (!isValidObjectId(id)) {
      return Promise.resolve(null);
    }

    return this.addressModel.findByIdAndDelete(id);
  }
}