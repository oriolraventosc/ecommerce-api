import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Product from "../../../database/models/product/product";
import CustomError from "../../customError/customError";
import connectToDatabase from "../../../database";
import Admin from "../../../database/models/admin/admin";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import enviroment from "../../../loadEnviroment";
import {
  acceptOrder,
  adminLogin,
  loadPendingOrders,
  cancelOrder,
} from "./adminController";
import adminData from "../../../mocks/adminMock";

let server: MongoMemoryServer;

beforeAll(async () => {
  await mongoose.disconnect();
  server = await MongoMemoryServer.create();
  await connectToDatabase(server.getUri());
});

beforeEach(async () => {
  await Product.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const tokenPayload = {};

const token = jwt.sign(tokenPayload, enviroment.jwtSecretKey);

const next = jest.fn();

describe("Given a adminController", () => {
  jest.setTimeout(25000);
  describe("When adminLogin is invoked with a username 'admin' and password 'admin'", () => {
    test("Then it should call it's method with a 200 status", async () => {
      const status = 200;

      const req: Partial<Request> = {
        body: { username: "admin", password: "admin", _id: 123 },
      };

      Admin.findOne = jest.fn().mockReturnValue({
        username: "admin",
        password: "admin",
        id: "admin",
        _id: 123,
        finishedOrders: [],
        pendingOrders: [],
      });
      jwt.sign = jest.fn().mockReturnValueOnce(token);
      bcrypt.compare = jest.fn().mockReturnValueOnce(true);

      await adminLogin(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(status);
    });
  });

  describe("When adminLogin is invoked with an empty body", () => {
    test("Then it should call it's next method", async () => {
      const customError = new CustomError(
        "Missing credentials",
        401,
        "Missing credentials"
      );
      const req: Partial<Request> = {
        body: {},
      };

      Admin.findOne = jest.fn().mockRejectedValue(customError);
      await adminLogin(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a response with an empty username and a password 'admin'", () => {
    test("Then it should call the next function with a customError", async () => {
      const customError = new CustomError(
        "Missing credentials",
        401,
        "Missing credentials"
      );
      const req: Partial<Request> = {
        body: { password: "admin" },
      };

      Admin.findOne = jest.fn().mockRejectedValue(customError);
      await adminLogin(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a response with an empty password and a username 'admin'", () => {
    test("Then it should call the next function with a customError", async () => {
      const customError = new CustomError(
        "Missing credentials",
        401,
        "Missing credentials"
      );
      const req: Partial<Request> = {
        body: { username: "admin" },
      };

      Admin.findOne = jest.fn().mockRejectedValue(customError);
      await adminLogin(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a response with a wrong password 'John'", () => {
    test("Then it should call the next function", async () => {
      const req: Partial<Request> = {
        body: { username: "admin", password: "AdmiN1" },
      };

      Admin.findOne = jest.fn().mockReturnValue({ username: "John" });
      await adminLogin(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a response with a wrong username 'John'", () => {
    test("Then it should call the next function", async () => {
      const req: Partial<Request> = {
        body: { username: "John", password: "" },
      };

      await adminLogin(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it recevies a response and an internal error happens", () => {
    test("Then it should respond with a 500 status", async () => {
      const customError = new CustomError(
        "Oops... General error",
        500,
        "Oops... General error"
      );

      const req: Partial<Request> = {
        body: { username: "admin", password: "admin" },
      };

      Admin.findOne = jest.fn().mockRejectedValue(customError);
      await adminLogin(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When loadPendingOrders is invoked with admin data", () => {
    test("Then it should return a 200 status", async () => {
      const status = 200;
      const req: Partial<Request> = {};

      Admin.findOne = jest.fn().mockReturnValue(adminData);
      await loadPendingOrders(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(status);
    });
  });

  describe("When loadPendingOrders is invoked and an internal server error occurres", () => {
    test("Then it should call it's next method", async () => {
      const customError = new CustomError(
        "Error loading data...",
        500,
        "Error loading data..."
      );

      const req: Partial<Request> = {};

      Admin.findOne = jest.fn().mockRejectedValue(customError);
      await loadPendingOrders(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When acceptOrder is invoked", () => {
    test("Then it should return a 200 status", async () => {
      const status = 200;
      const req: Partial<Request> = {
        params: { id: "admin" },
      };

      Admin.findOne = jest.fn().mockReturnValue(adminData);
      Admin.findOneAndUpdate = jest.fn().mockReturnValue(adminData);
      await acceptOrder(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(status);
    });
  });

  describe("When cancelOrder is invoked", () => {
    test("Then it should return a 200 status", async () => {
      const status = 200;
      const req: Partial<Request> = {
        params: { id: "admin" },
      };

      Admin.findOne = jest.fn().mockReturnValue(adminData);
      Admin.findOneAndUpdate = jest.fn().mockReturnValue(adminData);
      await cancelOrder(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(status);
    });
  });

  describe("When acceptOrder is invoked and an internal server error ocurres", () => {
    test("Then it should call it's next method", async () => {
      const req: Partial<Request> = {
        params: { id: "admin" },
      };

      const error = new CustomError(
        "Error accepting order...",
        500,
        "Error accepting order..."
      );

      Admin.findOne = jest.fn().mockReturnValue(adminData);
      Admin.findOneAndUpdate = jest.fn().mockRejectedValue(error);
      await acceptOrder(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When cancelOrder is invoked and an internal server error ocurres", () => {
    test("Then it should call it's next method", async () => {
      const req: Partial<Request> = {
        params: { id: "admin" },
      };

      const error = new CustomError(
        "Error cancelling order...",
        500,
        "Error cancelling order..."
      );

      Admin.findOne = jest.fn().mockReturnValue(adminData);
      Admin.findOneAndUpdate = jest.fn().mockRejectedValue(error);
      await acceptOrder(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });
});
