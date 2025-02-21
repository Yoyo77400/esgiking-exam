import { IMenu } from "../../models";
import { MongooseService } from "./mongoose.service";
import { Model, isValidObjectId } from "mongoose";
import { MenuSchema } from "./schema";
import { Models } from "./mongoose.models";

export  type ICreateMenu = Omit<IMenu, "_id" | "createdAt" | "updatedAt | products">;

export class MenuService {
    readonly mongooseService: MongooseService;
    readonly menuModel: Model<IMenu>;

    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.menuModel = this.mongooseService.mongoose.model(Models.Menu, MenuSchema);
    }

    async createMenu(menu: ICreateMenu): Promise<IMenu> {
        return this.menuModel.create({...menu, products: []});
    }

    async findMenuById(id: string): Promise<IMenu | null> {
        if(!isValidObjectId(id)) {
            return Promise.resolve(null);
        }
        return this.menuModel.findById(id).populate("products");
    }

    async findMenus(): Promise<IMenu[]> {
        return this.menuModel.find({}).populate("products");
    }

    async deleteMenuById(id: string): Promise<IMenu | null> {
        if(!isValidObjectId(id)) {
            return Promise.resolve(null);
        }
        return this.menuModel.findByIdAndDelete(id);
    }

    async addProductToMenu(menu_id: string, product_id: string): Promise<IMenu | null> {
        if(!isValidObjectId(menu_id) || !isValidObjectId(product_id)) {
            return Promise.resolve(null);
        }
        return this.menuModel.findByIdAndUpdate(menu_id, { $push: { products: product_id } }).populate("products");
    }

    async addPromotionToMenu(menu_id: string, promotion_id: string): Promise<IMenu | null> {
        if(!isValidObjectId(menu_id) || !isValidObjectId(promotion_id)) {
            return Promise.resolve(null);
        }
        return this.menuModel.findByIdAndUpdate(menu_id,  {promotion: promotion_id}).populate("promotion");
    }

    async removeProductFromMenu(menu_id: string, product_id: string): Promise<IMenu | null> {
        if(!isValidObjectId(menu_id) || !isValidObjectId(product_id)) {
            return Promise.resolve(null);
        }
        return this.menuModel.findByIdAndUpdate(menu_id, { $pull: { products: product_id } }).populate("products");
    }
}