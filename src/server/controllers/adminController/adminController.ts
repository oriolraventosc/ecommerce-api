import enviroment from "../../../loadEnviroment.js";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type {
  Credentials,
  Product,
  UserTokenPayload,
} from "../../../types/types.js";
import CustomError from "../../customError/customError.js";
import debugCreator from "debug";
import Admin from "../../../database/models/admin/admin.js";

const debug = debugCreator(`${enviroment.debug}adminController`);

export const adminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as Credentials;

  if (!username || !password) {
    const customError = new CustomError(
      "Missing credentials",
      401,
      "Missing credentials"
    );
    next(customError);
    return;
  }

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      const customError = new CustomError(
        "Wrong credentials!",
        401,
        "Wrong credentials!"
      );
      next(customError);
      return;
    }

    if (!(await bcrypt.compare(password, admin.password))) {
      const customError = new CustomError(
        "Wrong credentials!",
        401,
        "Wrong credentials!"
      );
      next(customError);
      return;
    }

    const tokenPayload: UserTokenPayload = {
      id: admin._id.toString(),
      username,
    };
    const accessToken = jwt.sign(tokenPayload, enviroment.jwtSecretKey, {
      expiresIn: "3d",
    });

    res.status(200).json({ accessToken });
    debug(`Welcome ${admin.username}`);
  } catch (error: unknown) {
    next(error);
  }
};

export const acceptOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findOne({ username: "admin" });
    const searchProduct = (product: Product) => product.name === id;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const product = admin.pendingOrders.find(searchProduct);
    const updatedPendingOrders = admin.pendingOrders.filter(
      (productToDelete) => productToDelete.name !== product.name
    );
    const updatedFinishedOrders = [...admin.finishedOrders, product];
    const updatedAdmin = await Admin.findOneAndUpdate(
      { username: "admin" },
      {
        username: "admin",
        password: "admin",
        id: "admin",
        pendingOrders: updatedPendingOrders,
        finishedOrders: updatedFinishedOrders,
      },
      { returnDocument: "after" }
    );
    res.status(200).json(updatedAdmin);
    debug(`${updatedAdmin.username} updated!`);
  } catch {
    const customError = new CustomError(
      "Error accepting order...",
      500,
      "Error accepting order..."
    );
    next(customError);
  }
};

export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findOne({ username: "admin" });
    const searchProduct = (product: Product) => product.name === id;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const product = admin.pendingOrders.find(searchProduct);
    const updatedPendingOrders = admin.pendingOrders.filter(
      (productToDelete) => productToDelete.name !== product.name
    );
    const updatedAdmin = await Admin.findOneAndUpdate(
      { username: "admin" },
      {
        username: "admin",
        password: "admin",
        id: "admin",
        pendingOrders: updatedPendingOrders,
        finishedOrders: [...admin.finishedOrders],
      },
      { returnDocument: "after" }
    );
    res.status(200).json(updatedAdmin);
    debug(`${updatedAdmin.username} updated!`);
  } catch {
    const customError = new CustomError(
      "Error cancelling order...",
      500,
      "Error cancelling order..."
    );
    next(customError);
  }
};
