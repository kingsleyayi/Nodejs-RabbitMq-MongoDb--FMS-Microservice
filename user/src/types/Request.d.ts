import { Request } from "express";
import { IUserWithId } from "../api/database/models/user";

declare global {
  namespace Express {
    export interface Request {
      user?: IUserWithId;
    }
  }
}

export interface MyReq extends Request {
  user?: IUserWithId;
}