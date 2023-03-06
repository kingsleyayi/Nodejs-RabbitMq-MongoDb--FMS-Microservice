import { Router } from "express";
import { unAssignedCars } from "../controllers/car";
import { validateToken } from "../middleware/authenticate.middleware";

const carRouter = Router();

carRouter.route("/unassignedCars").get(validateToken, unAssignedCars);
export default carRouter;
