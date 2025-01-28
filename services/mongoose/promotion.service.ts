import { IPromotion} from "../../models";
import { MongooseService } from "./mongoose.service";
import { isValidObjectId, Model } from "mongoose";
import { PromotionSchema } from "./schema";
import { Models } from "./mongoose.models";

export type ICreatePromotion = Omit<IPromotion, "_id" | "conditions" | "createdAt" | "updatedAt">;

export class PromotionService {

    readonly mongooseService: MongooseService;
    readonly promotionModel: Model<IPromotion>;

    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.promotionModel = this.mongooseService.mongoose.model(Models.Promotion, PromotionSchema);
    }

    async createPromotion(promotion: ICreatePromotion): Promise<IPromotion> {
        return this.promotionModel.create(promotion);
    }

    async findPromotionById(id: string): Promise<IPromotion | null> {
        if (!isValidObjectId(id)) {
            return Promise.resolve(null);
        }

        return this.promotionModel.findById(id);
    }

    async findPromotions(): Promise<IPromotion[]> {
        return this.promotionModel.find({});
    }

    async deletePromotionById(id: string): Promise<IPromotion | null> {
        if (!isValidObjectId(id)) {
            return Promise.resolve(null);
        }

        return this.promotionModel.findByIdAndDelete(id);
    }

    async updatePromotionById(id: string, promotion: ICreatePromotion): Promise<IPromotion | null> {
        if (!isValidObjectId(id)) {
            return Promise.resolve(null);
        }

        return this.promotionModel.findByIdAndUpdate(id, promotion);
    }
}