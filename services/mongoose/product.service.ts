import { IProduct } from '../../models';
import { MongooseService } from './mongoose.service';
import { isValidObjectId, Model } from 'mongoose';
import { ProductSchema } from './schema';
import { Models } from './mongoose.models';

export type ICreateProduct = Omit<IProduct, '_id' | 'promotions' | 'createdAt' | 'updatedAt'>;

export class ProductService {
  readonly mongooseService: MongooseService;
  readonly productModel: Model<IProduct>;

  constructor(mongooseService: MongooseService) {
    this.mongooseService = mongooseService;
    this.productModel = this.mongooseService.mongoose.model(Models.Product, ProductSchema);
  }

  async createProduct(restaurant: ICreateProduct): Promise<IProduct> {
    return this.productModel.create(restaurant);
  }

  async findProductById(id: string): Promise<IProduct | null> {
    if (!isValidObjectId(id)) {
      return Promise.resolve(null);
    }

    return this.productModel.findById(id).populate('promotions');
  }

  async findProducts(): Promise<IProduct[]> {
    return this.productModel.find({}).populate('promotions');
  }

  async deleteProductById(id: string): Promise<IProduct | null> {
    if (!isValidObjectId(id)) {
      return Promise.resolve(null);
    }

    return this.productModel.findByIdAndDelete(id);
  }

  async removePromotionFromProduct(
    product_id: string,
    promotion_id: string,
  ): Promise<IProduct | null> {
    if (!isValidObjectId(product_id) || !isValidObjectId(promotion_id)) {
      return Promise.resolve(null);
    }

    return this.productModel
      .findByIdAndUpdate(product_id, { $pull: { promotions: promotion_id } })
      .populate('promotions');
  }
}
