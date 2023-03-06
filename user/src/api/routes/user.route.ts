import { Router } from "express";
import {
  assignCar,
  LoginUser,
  updateUserRideStatus,
  userData,
  userRegistration,
} from "../controllers/user";
import { validateToken } from "../middleware/authenticate.middleware";
import {
  userLoginValidator,
  userRegistrationValidator,
} from "../validators/user";

const userRouter = Router();

userRouter
  .route("/registration")
  .post(userRegistrationValidator, userRegistration);

userRouter.route("/login").post(userLoginValidator, LoginUser);

userRouter.route("/userData").get(validateToken, userData);

userRouter.route("/assignCar/:carId").put(validateToken, assignCar);
userRouter
  .route("/updateRideStatus/:status")
  .put(validateToken, updateUserRideStatus);
  
export default userRouter;
