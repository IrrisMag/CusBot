import express from 'express';
const router = express.Router();
import { createProduct, deleteProduct, getProducts, updateProduct } from '../controllers/product.controller.js';




router.post("/", createProduct);

router.delete("/:id", deleteProduct);

router.get("/", getProducts);

router.put("/:id", updateProduct);




export default router;