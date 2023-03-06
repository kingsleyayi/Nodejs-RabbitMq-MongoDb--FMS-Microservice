import {
  modelOptions,
  prop,
  Ref,
  getModelForClass,
} from "@typegoose/typegoose";
import { Schema } from "mongoose";
import { CarStatus, Status } from "../../../utils/enum";

Status;
@modelOptions({ schemaOptions: { timestamps: true, collection: "cars" } })
class ICar {
  @prop()
  public brand?: string;

  @prop({ unique: true })
  public ref?: string;

  @prop({ enum: CarStatus, required: true, default: CarStatus.NOTASSIGNED })
  public status?: Status;

  @prop({ default: Date.now })
  public createdAt?: Date;
}

const Car = getModelForClass(ICar);

interface ICarWithId extends ICar {
  _id: Schema.Types.ObjectId;
}

export { Car, ICar, ICarWithId };
