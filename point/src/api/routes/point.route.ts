import { Router } from "express";
import { userPoint } from "../controllers/point";
import { validateToken } from "../middleware/authenticate";

const pointRouter = Router();

pointRouter.route("/pointRouter").get(validateToken, userPoint);

export default pointRouter;
