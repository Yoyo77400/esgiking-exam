import { IChat } from "../../models";
import { MongooseService } from "./mongoose.service";
import { Model, isValidObjectId } from "mongoose";
import { ChatSchema } from "./schema";
import { Models } from "./mongoose.models";

export type ICreateChat = Omit<IChat, "_id" | "createdAt" | "updatedAt">;

export class ChatService {
  readonly mongooseService: MongooseService;
  readonly chatModel: Model<IChat>;

  constructor(mongooseService: MongooseService) {
    this.mongooseService = mongooseService;
    this.chatModel = this.mongooseService.mongoose.model(
      Models.Chat,
      ChatSchema
    );
  }

  async createChat(chat: ICreateChat): Promise<IChat> {
    return this.chatModel.create(chat);
  }

  async findChatById(id: string): Promise<IChat | null> {
    if (!isValidObjectId(id)) {
      return Promise.resolve(null);
    }
    return this.chatModel.findById(id).populate("delivery");
  }

  async findChatsByDeliveryId(id: string): Promise<IChat[] |null> {
    if (!isValidObjectId(id)) {
      return Promise.resolve(null);
    }
    return this.chatModel.find({ delivery_id: id })
      .sort({ createdAt: -1 })
      .populate("deliveries");
  }

  async deleteChatById(id: string): Promise<IChat | null> {
    if (!isValidObjectId(id)) {
      return Promise.resolve(null);
    }
    return this.chatModel.findByIdAndDelete(id);
  }
}
