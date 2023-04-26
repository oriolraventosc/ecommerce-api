import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import { checkoutProducts, loadAllProducts } from "./productController";
import Product from "../../../database/models/product/product";
import CustomError from "../../customError/customError";
import connectToDatabase from "../../../database";
import productUSBMock from "../../../mocks/productMock";
import Admin from "../../../database/models/admin/admin";

let server: MongoMemoryServer;

beforeAll(async () => {
  await mongoose.disconnect();
  server = await MongoMemoryServer.create();
  await connectToDatabase(server.getUri());
});

beforeEach(async () => {
  await Product.deleteMany({});
  await Admin.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

const next = jest.fn();
const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Given a productsController", () => {
  jest.setTimeout(25000);
  describe("When loadProduct is invoked with 1 product", () => {
    test("Then it should return an object with a product property products with 1 product data", async () => {
      const status = 200;
      const req: Partial<Request> = {};
      Product.find = jest
        .fn()
        .mockReturnValue({ productsList: [productUSBMock] });
      await loadAllProducts(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(status);
    }, 10000);
  });

  describe("When loadProduct is invoked with no product", () => {
    test("Then it should return a 204 status", async () => {
      const status = 204;
      const req: Partial<Request> = {};

      Product.find = jest.fn().mockReturnValue(null);
      await loadAllProducts(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(status);
    }, 10000);
  });

  describe("When loadProduct is invoked and an error happens", () => {
    test("Then it should return an error", async () => {
      const error = new CustomError(
        "A general server errror ocurred while loading the products!",
        500,
        "A general server errror ocurred while loading the products!"
      );
      const req: Partial<Request> = {};

      Product.find = jest.fn().mockRejectedValue(error);
      await loadAllProducts(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    }, 10000);
  });

  describe("When checkoutProducts is invoked with 1 product at the cart", () => {
    test("Then it should return a 200 status", async () => {
      const status = 200;
      const req: Partial<Request> = {
        body: {
          name: "John",
          email: "john@gmail.com",
          pendingProducts: [productUSBMock],
        },
      };

      Admin.findOne = jest.fn().mockReturnValue({
        username: "admin",
        password: "admin",
        id: "admin",
        finishedOrders: [],
        pendingOrders: [],
      });
      Admin.findOneAndUpdate = jest.fn().mockReturnValue({
        username: "admin",
        password: "admin",
        id: "admin",
        finishedOrders: [],
        pendingOrders: [productUSBMock],
      });
      await checkoutProducts(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(status);
    });
  });

  describe("When checkoutProducts is invoked with 1 product at the cart and an internal server error ocurres", () => {
    test("Then it should return a 500 status and next invoked", async () => {
      const req: Partial<Request> = {
        body: {
          name: "John",
          email: "john@gmail.com",
          pendingProducts: [productUSBMock],
        },
      };
      const error = new CustomError(
        "Error updating...",
        500,
        "Error updating..."
      );

      Admin.findOne = jest.fn().mockReturnValue({
        username: "admin",
        password: "admin",
        id: "admin",
        finishedOrders: [],
        pendingOrders: [],
      });
      Admin.findOneAndUpdate = jest.fn().mockRejectedValue(error);
      await checkoutProducts(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});
