import morgan from "morgan";
import express from "express";
import cors from "cors";
import { generalError, endpointUnknown } from "./middlewares/error.js";
import routes from "./routes/routes.js";
import productRouter from "./router/productRouter/productRouter.js";
import adminRouter from "./router/adminRouter/adminRouter.js";

const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(express.json());

app.use(routes.productsRouter, cors(), productRouter);

app.use(routes.adminRouter, cors(), adminRouter);

app.use(endpointUnknown);

app.use(generalError);

export default app;
