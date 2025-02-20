import express from "express";
import { MongooseService } from "../services/mongoose";
import { sessionMiddleware } from "../middleware";

export class ChatController {
  private static instance?: ChatController;

  static getInstance(): ChatController {
    if (!ChatController.instance) {
      ChatController.instance = new ChatController();
    }

    return ChatController.instance;
  }

  async createChat(req: express.Request, res: express.Response): Promise<void> {
    if (!req.body || typeof req.body.delivery_id !== "string" || typeof req.body.message !== "string") {
      res.status(400).end();
      return;
    }

    const mongooseService = await MongooseService.getInstance();
    const chatService = mongooseService.chatService;
    const chat = await chatService.createChat(req.body);
    res.json(chat);
  }

  async getChatByDeliveryId(req: express.Request, res: express.Response): Promise<void> {
    if (!req.params.delivery_id || typeof req.params.delivery_id !== "string") {
      res.status(400).end();
      return;
    }

    const mongooseService = await MongooseService.getInstance();
    const chatService = mongooseService.chatService;
    const chat = await chatService.findChatByDeliveryId(req.params.delivery_id);
    res.json(chat);
  }

  buildRouter(): express.Router {
    const router = express.Router();
    router.post("/", express.json(), sessionMiddleware(), this.createChat);
    router.get("/:delivery_id", express.json(), sessionMiddleware(), this.getChatByDeliveryId);
    return router;
  }
}
