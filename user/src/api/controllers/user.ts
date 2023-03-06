import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Types } from "mongoose";
import { BadRequestDataError } from "../../core/ApiError";
import { SuccessResponse } from "../../core/ApiReponse";
import asyncHandler from "../../services/asyncHandler";
import UserService from "../../services/user";

export const userRegistration = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw new BadRequestDataError(
        errors.array({ onlyFirstError: true })[0].msg,
        errors
      );

    const user = await UserService.userRegistration(req);
    return new SuccessResponse(
      "congratulations you have successfully registered",
      {
        user,
      }
    ).send(res);
  }
);

export const LoginUser = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw new BadRequestDataError(
        errors.array({ onlyFirstError: true })[0].msg,
        errors
      );

    const user = await UserService.loginUser(req);
    return new SuccessResponse("user logged in successfully", {
      ...user,
    }).send(res);
  }
);

export const userData = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw new BadRequestDataError(
        errors.array({ onlyFirstError: true })[0].msg,
        errors
      );

    const user = await UserService.userData(req);
    return new SuccessResponse("user Data searched successfully", {
      ...user,
    }).send(res);
  }

);


export const assignCar = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw new BadRequestDataError(
        errors.array({ onlyFirstError: true })[0].msg,
        errors
      );

    const userId = req.user?._id.toString() || "";

    const user = await UserService.assignCar(userId, req.params.carId);
    return new SuccessResponse("user car assigned successfully", {
      ...user,
    }).send(res);
  }
);

export const updateUserRideStatus = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw new BadRequestDataError(
        errors.array({ onlyFirstError: true })[0].msg,
        errors
      );
    const user = await UserService.UpdateUserStatus(req);
    return new SuccessResponse("user rider status updated successfully", {
      ...user,
    }).send(res);
  }
);