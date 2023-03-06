import { Request } from "express";

interface user {
  id: string;
}
declare global {
  namespace Express {
    export interface Request {
      user?: user;
    }
  }
}

export interface MyReq extends Request {
  user?: user;
}
