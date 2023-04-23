import express from "express";
import routes from "../../routes/routes.js";
import {
  acceptOrder,
  adminLogin,
  cancelOrder,
} from "../../controllers/adminController/adminController.js";

// eslint-disable-next-line new-cap
const adminRouter = express.Router();

adminRouter.post(routes.login, adminLogin);

adminRouter.patch(routes.acceptOrder, acceptOrder);

adminRouter.patch(routes.cancelOrder, cancelOrder);

export default adminRouter;
