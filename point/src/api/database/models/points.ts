import {
  modelOptions,
  prop,
  Ref,
  getModelForClass,
} from "@typegoose/typegoose";
import mongoose, { Schema, Types } from "mongoose";

@modelOptions({ schemaOptions: { timestamps: true, collection: "points" } })
class IPoint {
  @prop({ type: mongoose.Schema.Types.ObjectId })
  public carId?: Types.ObjectId;

  @prop({ type: mongoose.Schema.Types.ObjectId })
  public userId?: Types.ObjectId;

  @prop()
  public latitude?: number;

  @prop()
  public longitude?: number;

  @prop()
  public point?: number;

  @prop()
  public speed?: number;

  @prop({ default: Date.now })
  public createdAt?: Date;
}

const Point = getModelForClass(IPoint);

interface IPointWithId extends IPoint {
  _id: Schema.Types.ObjectId;
}

export { Point, IPoint, IPointWithId };
