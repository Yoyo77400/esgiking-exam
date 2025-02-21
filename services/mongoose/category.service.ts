import { ICategory } from "../../models";
import { MongooseService } from "./mongoose.service";
import { Model, isValidObjectId } from "mongoose";
import { CategorySchema } from "./schema";
import { Models } from "./mongoose.models";

export type ICreateCategory = Omit<ICategory, "_id" | "createdAt" | "updatedAt">;

export class CategoryService {
    readonly mongooseService: MongooseService;
    readonly categoryModel: Model<ICategory>;
    
    constructor(mongooseService: MongooseService) {
        this.mongooseService = mongooseService;
        this.categoryModel = this.mongooseService.mongoose.model(Models.Category, CategorySchema);
    }
    
    async createCategory(category: ICreateCategory): Promise<ICategory> {
        return this.categoryModel.create(category);
    }
    
    async findCategoryById(id: string): Promise<ICategory | null> {
        if(!isValidObjectId(id)) {
            return Promise.resolve(null);
        }
        return this.categoryModel.findById(id).populate("products");
    }
    
    async findCategories(): Promise<ICategory[]> {
        return this.categoryModel.find({}).populate("products");
    }

    async findProductsByCategory(id: string): Promise<ICategory | null> {
        if(!isValidObjectId(id)) {
            return Promise.resolve(null);
        }
        const mongooseService = await MongooseService.getInstance();
        const productService = mongooseService.productService;
        return this.categoryModel.findById(id).populate("products");
    }
    
    async deleteCategoryById(id: string): Promise<ICategory | null> {
        if(!isValidObjectId(id)) {
            return Promise.resolve(null);
        }
        return this.categoryModel.findByIdAndDelete(id);
    }

    async addProductToCategory(category_id: string | undefined, product_id: string): Promise<ICategory | null> {
        if(!isValidObjectId(category_id) || !isValidObjectId(product_id)) {
            return Promise.resolve(null);
        }
        return this.categoryModel.findByIdAndUpdate(category_id, { $push: {products: product_id} }, { new : true}).populate("products");
    }

    async removeProductFromCategory(category_id: string, product_id: string): Promise<ICategory | null> {
        if(!isValidObjectId(category_id) || !isValidObjectId(product_id)) {
            return Promise.resolve(null);
        }
        return this.categoryModel.findByIdAndUpdate(category_id, { $pull: { products: product_id } }).populate("products");
    }
}