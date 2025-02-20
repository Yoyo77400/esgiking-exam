import express from "express";
import { MongooseService } from "../services/mongoose";
import { sessionMiddleware, roleMiddleware } from "../middleware";
import { IEmployeeRole } from "../models";

export class ChatController {
  private static instance?: ChatController;

  static getInstance(): ChatController {
    if (!ChatController.instance) {
      ChatController.instance = new ChatController();
    }

    return ChatController.instance;
  }

  async createChat(req: express.Request, res: express.Response): Promise<void> {
    if (!req.body || typeof req.body.delivery_id !== "string") {
      res.status(400).end();
      return;
    }

    const mongooseService = await MongooseService.getInstance();
    const categoryService = mongooseService.chatService;
    const category = await categoryService.createChat(req.body);
    res.json(category);
  }

  buildRouter(): express.Router {
    const router = express.Router();
    router.post("/", express.json(), sessionMiddleware(), this.createChat);
    router.get("/chat:id", express.json(), this.getCategory);
    router.delete(
      "/category:id",
      sessionMiddleware(),
      roleMiddleware(IEmployeeRole.ADMIN || IEmployeeRole.MANAGER),
      this.deleteCategory
    );
    return router;
  }
}
