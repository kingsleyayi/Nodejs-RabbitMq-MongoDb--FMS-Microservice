import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { BadRequestDataError } from "../../core/ApiError";
import { SuccessResponse } from "../../core/ApiReponse";
import asyncHandler from "../../services/asyncHandler";
import PointService from "../../services/point";

export const userPoint = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      throw new BadRequestDataError(
        errors.array({ onlyFirstError: true })[0].msg,
        errors
      );

    const userPoints = await PointService.userPoints(req);
    return new SuccessResponse("user Points featched successfully", {
      ...userPoints,
    }).send(res);
  }
);
