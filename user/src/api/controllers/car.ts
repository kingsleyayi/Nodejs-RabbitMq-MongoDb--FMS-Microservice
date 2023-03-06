import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { BadRequestDataError } from "../../core/ApiError";
import { SuccessResponse } from "../../core/ApiReponse";
import asyncHandler from "../../services/asyncHandler";
import CarService from "../../services/car";

export const unAssignedCars = asyncHandler(
    async (req: Request, res: Response): Promise<Response> => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        throw new BadRequestDataError(
          errors.array({ onlyFirstError: true })[0].msg,
          errors
        );
  
      const cars = await CarService.unAssinedCars();
      return new SuccessResponse("List of unassigned cars", {
        cars,
      }).send(res);
    }
  );