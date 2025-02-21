import express from "express";
import { MongooseService } from "../services/mongoose";
import { sessionMiddleware, roleMiddleware } from "../middleware";
import { IEmployeeRole } from "../models";

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated product ID
 *         name:
 *           type: string
 *           description: Name of the product
 *         description:
 *           type: string
 *           description: Description of the product
 *         price:
 *           type: number
 *           description: Price of the product
 *         category:
 *           type: string
 *           description: ID of the category this product belongs to
 *         image:
 *           type: string
 *           description: URL of the product image
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */
export class ProductController {
  private static instance?: ProductController;

  static getInstance(): ProductController {
    if (!ProductController.instance) {
      ProductController.instance = new ProductController();
    }
    return ProductController.instance;
  }

  /**
   * @swagger
   * /products:
   *   post:
   *     tags: [Products]
   *     summary: Create a new product
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - category
   *             properties:
   *               name:
   *                 type: string
   *                 description: Product name
   *               description:
   *                 type: string
   *                 description: Product description
   *               price:
   *                 type: number
   *                 description: Product price
   *               category:
   *                 type: string
   *                 description: Category ID
   *               image:
   *                 type: string
   *                 description: Product image URL
   *     responses:
   *       200:
   *         description: Product created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 product:
   *                   $ref: '#/components/schemas/Product'
   *                 updatedCategory:
   *                   $ref: '#/components/schemas/Category'
   *       400:
   *         description: Invalid request body
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Requires ADMIN role
   */
  async createProduct(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    if (!req.body || typeof req.body.name !== "string") {
      res.status(400).end();
      return;
    }

    const mongooseService = await MongooseService.getInstance();
    const productService = mongooseService.productService;
    const product = await productService.createProduct(req.body);
    const categoryService = mongooseService.categoryService;
    const category = await categoryService.findCategoryById(req.body.category);
    const updatedCategory = await categoryService.addProductToCategory(category?._id, product._id);

    res.json({ product, updatedCategory });
  }

  /**
   * @swagger
   * /products/product/{id}:
   *   get:
   *     tags: [Products]
   *     summary: Get a product by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Product ID
   *     responses:
   *       200:
   *         description: Product found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   *       400:
   *         description: Invalid product ID
   *       404:
   *         description: Product not found
   */
  async getProduct(req: express.Request, res: express.Response): Promise<void> {
    if (!req.params.id) {
      res.status(400).end();
      return;
    }

    const mongooseService = await MongooseService.getInstance();
    const productService = mongooseService.productService;
    const product = await productService.findProductById(req.params.id);
    if (!product) {
      res.status(404).end();
      return;
    }
    res.json(product);
  }

  /**
   * @swagger
   * /products:
   *   get:
   *     tags: [Products]
   *     summary: Get all products
   *     responses:
   *       200:
   *         description: List of all products
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Product'
   */
  async getaAllProducts(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const mongooseService = await MongooseService.getInstance();
    const productService = mongooseService.productService;
    const products = await productService.findProducts();
    res.json(products);
  }

  /**
   * @swagger
   * /products/product/{id}:
   *   delete:
   *     tags: [Products]
   *     summary: Delete a product
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Product ID to delete
   *     responses:
   *       204:
   *         description: Product deleted successfully
   *       400:
   *         description: Invalid product ID
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Requires ADMIN role
   *       404:
   *         description: Product not found
   */
  async deleteProduct(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    if (!req.params.id) {
      res.status(400).end();
      return;
    }

    const mongooseService = await MongooseService.getInstance();
    const productService = mongooseService.productService;
    const product = await productService.deleteProductById(req.params.id);
    if (!product) {
      res.status(404).end();
      return;
    }
    res.status(204).end();
  }

  buildRouter(): express.Router {
    const router = express.Router();
    router.get("/product/:id", express.json(), this.getProduct.bind(this));
    router.delete(
      "/product/:id",
      sessionMiddleware(),
      roleMiddleware([IEmployeeRole.ADMIN]),
      this.deleteProduct.bind(this)
    );
    router.get(
      "/",
      express.json(),
      this.getaAllProducts.bind(this)
    );
    router.post(
      "/",
      sessionMiddleware(),
      express.json(),
      roleMiddleware([IEmployeeRole.ADMIN]),
      this.createProduct.bind(this)
    );
    return router;
  }
}
