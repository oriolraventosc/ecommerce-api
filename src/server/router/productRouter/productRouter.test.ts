import routes from "../../routes/routes";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import connectToDatabase from "../../../database/index";
import mongoose from "mongoose";
import app from "../../app";
import CustomError from "../../customError/customError";
import Product from "../../../database/models/product/product";
import Admin from "../../../database/models/admin/admin";
import productUSBMock from "../../../mocks/productMock";

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
  await Product.deleteMany({});
  await Admin.deleteMany({});
  await mongoose.disconnect();
  await server.stop();
});

describe("Given a GET /products/loadAll endpoint", () => {
  jest.setTimeout(25000);
  describe("When it receives a request with an empty body and 1 product in the data base", () => {
    test("Then it should respons with a 200 status", async () => {
      const status = 200;

      const response = await request(app)
        .get(`${routes.productsRouter}${routes.loadProducts}`)
        .expect(status);

      expect(response.body).toHaveProperty("productsList");
    });
  });

  describe("When it receives a request with an empty body and 0 product in the data base", () => {
    test("Then it should respons with a 200 status", async () => {
      const status = 204;

      Product.find = jest.fn().mockReturnValue(null);
      const response = await request(app)
        .get(`${routes.productsRouter}${routes.loadProducts}`)
        .expect(status);

      expect(response.body).toStrictEqual({});
    });
  });

  describe("When it receives a request with an empty body and 0 product in the data base", () => {
    test("Then it should respons with a 500 status when an error ocurres", async () => {
      const status = 500;
      const error = new CustomError(
        "A general server errror ocurred while loading the products!",
        500,
        "A general server errror ocurred while loading the products!"
      );

      Product.find = jest.fn().mockRejectedValue(error);
      const response = await request(app)
        .get(`${routes.productsRouter}${routes.loadProducts}`)
        .expect(status);

      expect(response.body).toHaveProperty("error");
    });
  });
});

describe("Given a PATCH /products/checkout endpoint", () => {
  jest.setTimeout(25000);
  describe("When it receives a request with a name, email and pendingProducts properties", () => {
    test("Then it should return a 200 status", async () => {
      const status = 200;

      const data = {
        name: "admin",
        email: "admin@gmail.com",
        pendingProducts: [productUSBMock],
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
      const response = await request(app)
        .patch(`${routes.productsRouter}${routes.checkout}`)
        .send(data)
        .expect(status);

      expect(response.body).toHaveProperty("pendingOrders");
    });
  });

  describe("When it receives a request with a name, email and pendingProducts properties and an error ocurres", () => {
    test("Then it should return a 500 status", async () => {
      const status = 500;

      const error = new CustomError(
        "Error updating...",
        500,
        "Error updating..."
      );

      const data = {
        name: "admin",
        email: "admin@gmail.com",
        pendingProducts: [productUSBMock],
      };

      Admin.findOne = jest.fn().mockReturnValue({
        username: "admin",
        password: "admin",
        id: "admin",
        finishedOrders: [],
        pendingOrders: [],
      });
      Admin.findOneAndUpdate = jest.fn().mockRejectedValue(error);
      const response = await request(app)
        .patch(`${routes.productsRouter}${routes.checkout}`)
        .send(data)
        .expect(status);

      expect(response.body).toHaveProperty("error");
    });
  });
});
