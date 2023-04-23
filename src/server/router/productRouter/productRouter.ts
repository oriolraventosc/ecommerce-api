import express from "express";
import routes from "../../routes/routes.js";
import {
  checkoutProducts,
  loadAllProducts,
} from "../../controllers/productsController/productController.js";

// eslint-disable-next-line new-cap
const productRouter = express.Router();

productRouter.get(routes.loadProducts, loadAllProducts);
productRouter.patch(routes.checkout, checkoutProducts);

export default productRouter;
