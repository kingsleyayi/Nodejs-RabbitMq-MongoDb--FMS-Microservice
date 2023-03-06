import { Response, NextFunction } from "express";
import { BadTokenError } from "../../core/ApiError";
import asyncHandler from "../../services/asyncHandler";
import { MyReq } from "../../types/Request";
import { verifyToken } from "../../utils/jwt";

export const validateToken = asyncHandler(
  async (req: MyReq, __res: Response, next: NextFunction): Promise<any> => {
    const token: string = req.headers["authorization"]
      ? req.headers["authorization"].toString()
      : "";
    if (!token) {
      throw new BadTokenError(
        "Unauthorized, Please provide authentication token!"
      );
    }
    try {
      const details = await verifyToken(token);
      const id = details.id;
      req.user = { id: id! };
      next();
    } catch (error) {
      throw new BadTokenError(
        "Your login session has expired, Please login again."
      );
    }
  }
);
