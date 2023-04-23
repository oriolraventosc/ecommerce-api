import enviroment from "../../../loadEnviroment.js";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Credentials, UserTokenPayload } from "../../../types/types.js";
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
