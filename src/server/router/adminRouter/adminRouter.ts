import express from "express";
import routes from "../../routes/routes.js";
import { adminLogin } from "../../controllers/adminController/adminController.js";

// eslint-disable-next-line new-cap
const adminRouter = express.Router();

adminRouter.post(routes.login, adminLogin);

export default adminRouter;
