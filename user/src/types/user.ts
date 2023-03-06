import { IUserWithId } from "../api/database/models/user";

export interface IUserWithToken {
    user: IUserWithId;
    token: string;
  }