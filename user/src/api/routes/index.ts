import cors from "cors";
import { Router } from "express";
import { allowedOrigins } from "../../utils/constants";
import carRouter from "./car.route";
import userRouter from "./user.route";

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

const router = Router();

router.use("/user", cors(options), userRouter);
router.use("/car", cors(options), carRouter);


export default router;
