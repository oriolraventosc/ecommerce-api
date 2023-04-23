import type { Request, Response, NextFunction } from "express";
import Product from "../../../database/models/product/product.js";
import debugCreator from "debug";
import enviroment from "../../../loadEnviroment.js";
import CustomError from "../../customError/customError.js";
import type { CheckoutData } from "../../../types/types.js";
import Admin from "../../../database/models/admin/admin.js";

const debug = debugCreator(`${enviroment.debug}productsController`);

export const loadAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find();
    if (!products) {
      res.status(204).json({
        productsList: [],
      });
      debug("There are no products in sale");
    }

    res.status(200).json({
      productsList: [...products],
    });
    debug(`There are ${products.length} products in sale`);
  } catch {
    const error = new CustomError(
      "A general server errror ocurred while loading the products!",
      500,
      "A general server errror ocurred while loading the products!"
    );
    next(error);
  }
};

export const checkoutProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pendingProducts, name, email } = req.body as CheckoutData;
  if (!name || !email) {
    const customError = new CustomError(
      "Missing information",
      401,
      "Missing information"
    );
    next(customError);
    return;
  }

  try {
    const admin = await Admin.findOne({ username: "admin" });
    const updatedAdmin = await Admin.findOneAndUpdate(
      { username: "admin" },
      {
        username: "admin",
        password: "admin",
        pendingOrders: [...admin.pendingOrders, ...pendingProducts],
        finishedOrders: [...admin.finishedOrders],
        id: "admin",
      },
      { returnDocument: "after" }
    );

    pendingProducts.forEach(async (product) => {
      await Product.findOneAndDelete({ name: product.name });
    });

    res.status(200).json(updatedAdmin);
    debug(`${updatedAdmin.username} updated!`);
  } catch {
    const customError = new CustomError(
      "Error updating...",
      500,
      "Error updating..."
    );
    next(customError);
  }
};
