import cors from "cors";
import { Router } from "express";
import { allowedOrigins } from "../../utils/constants";
import pointRouter from "./point.route";

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

const router = Router();

router.use("/point", cors(options), pointRouter);

export default router;
