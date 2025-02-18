import express from "express";
import { MongooseService } from "../services/mongoose";
import { sessionMiddleware, roleMiddleware } from "../middleware";
import { IEmployeeRole } from "../models";

export class ProductController {
  private static instance?: ProductController;

  static getInstance(): ProductController {
    if (!ProductController.instance) {
      ProductController.instance = new ProductController();
    }

    return ProductController.instance;
  }

  async createProduct(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    if (!req.body || typeof req.body.name !== "string") {
      res.status(400).end();
      return;
    }

    const mongooseService = await MongooseService.getInstance();
    const orderService = mongooseService.orderService;
    const product = await orderService.createProduct(req.body);
    res.json(product);
  }

  async getProduct(req: express.Request, res: express.Response): Promise<void> {
    if (!req.params.id) {
      res.status(400).end();
      return;
    }

    const mongooseService = await MongooseService.getInstance();
    const orderService = mongooseService.orderService;
    const product = await orderService.findProductById(req.params.id);
    if (!product) {
      res.status(404).end();
      return;
    }
    res.json(product);
  }

  async deleteProduct(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    if (!req.params.id) {
      res.status(400).end();
      return;
    }

    const mongooseService = await MongooseService.getInstance();
    const orderService = mongooseService.orderService;
    const product = await orderService.deleteProductById(req.params.id);
    if (!product) {
      res.status(404).end();
      return;
    }
    res.status(204).end();
  }

  buildRouter(): express.Router {
    const router = express.Router();
    router.get("/product:id", express.json(), this.getProduct.bind(this));
    router.delete(
      "/product:id",
      sessionMiddleware(),
      roleMiddleware(IEmployeeRole.MANAGER || IEmployeeRole.ADMIN),
      this.deleteProduct.bind(this)
    );
    router.post(
      "/",
      sessionMiddleware(),
      express.json(),
      roleMiddleware(IEmployeeRole.MANAGER || IEmployeeRole.ADMIN),
      this.createProduct.bind(this)
    );
    return router;
  }
}
