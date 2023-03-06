import {
  modelOptions,
  prop,
  Ref,
  getModelForClass,
} from "@typegoose/typegoose";
import mongoose, { Schema, Types } from "mongoose";
import { Status } from "../../../utils/enum";

Status;
@modelOptions({ schemaOptions: { timestamps: true, collection: "users" } })
class IUser {
  @prop()
  public name?: string;

  @prop({ unique: true })
  public email?: string;

  @prop()
  public password?: string;

  @prop({ enum: Status, required: true, default: Status.ACTIVE })
  public status?: Status;

  @prop()
  public address?: string;

  @prop({ type: mongoose.Schema.Types.ObjectId, ref: 'cars' })
  public carId?: Types.ObjectId;

  @prop({ default: Date.now })
  public createdAt?: Date;
}

const User = getModelForClass(IUser);

interface IUserWithId extends IUser {
  _id: Schema.Types.ObjectId;
}

export { User, IUser, IUserWithId, Status };
