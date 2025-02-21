import express from "express";
import { MongooseService } from "../services/mongoose";
import { sessionMiddleware } from "../middleware";

/**
 * @swagger
 * components:
 *   schemas:
 *     Chat:
 *       type: object
 *       required:
 *         - _id
 *         - delivery_id
 *         - message
 *         - is_read
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the chat
 *         delivery_id:
 *           type: string
 *           description: The ID of the delivery this chat belongs to
 *         message:
 *           type: string
 *           description: The chat message content
 *         is_read:
 *           type: boolean
 *           description: Whether the message has been read
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the chat was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the chat was last updated
 * 
 * tags:
 *   name: Chats
 *   description: Chat management API endpoints
 */
export class ChatController {
  private static instance?: ChatController;

  static getInstance(): ChatController {
    if (!ChatController.instance) {
      ChatController.instance = new ChatController();
    }
    return ChatController.instance;
  }

  /**
   * @swagger
   * /chat/{delivery_id}:
   *   post:
   *     tags: [Chats]
   *     summary: Create a new chat message
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: delivery_id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the delivery to create chat for
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - message
   *             properties:
   *               message:
   *                 type: string
   *                 description: Chat message content
   *     responses:
   *       201:
   *         description: Chat message created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Chat'
   *       400:
   *         description: Invalid request body or delivery_id
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       404:
   *         description: Delivery not found
   */
  async createChat(req: express.Request, res: express.Response): Promise<void> {
    if (!req.body || typeof req.params.delivery_id !== "string" || typeof req.body.message !== "string") {
      res.status(400).end();
      return;
    }

    const mongooseService = await MongooseService.getInstance();
    const chatService = mongooseService.chatService;
    const chat = await chatService.createChat(req.body);
    res.status(201).json(chat);
  }

  /**
   * @swagger
   * /chat/{delivery_id}:
   *   get:
   *     tags: [Chats]
   *     summary: Get all chat messages for a specific delivery
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: delivery_id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the delivery to get chats for
   *     responses:
   *       200:
   *         description: List of chat messages
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Chat'
   *       400:
   *         description: Invalid delivery ID
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       404:
   *         description: No chats found for this delivery
   */
  async getChatByDeliveryId(req: express.Request, res: express.Response): Promise<void> {
    if (!req.params.delivery_id || typeof req.params.delivery_id !== "string") {
      res.status(400).end();
      return;
    }

    const mongooseService = await MongooseService.getInstance();
    const chatService = mongooseService.chatService;
    const chat = await chatService.findChatsByDeliveryId(req.params.delivery_id);
    
    if (!chat) {
      res.status(404).end();
      return;
    }
    
    res.json(chat);
  }

  buildRouter(): express.Router {
    const router = express.Router();
    router.post("/:delivery_id", express.json(), sessionMiddleware(), this.createChat);
    router.get("/:delivery_id", express.json(), sessionMiddleware(), this.getChatByDeliveryId);
    return router;
  }
}
