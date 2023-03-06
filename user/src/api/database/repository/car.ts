import { Types } from "mongoose";
import { Car, ICarWithId } from "../models/car";
import { MgFilterQuery, MgUpdateQuery } from "./mongoofe.types";

class CarRepo {
  public static async update(
    carId: string,
    update: MgUpdateQuery<ICarWithId>
  ): Promise<ICarWithId | null> {
    return Car.findOneAndUpdate({ _id: carId }, update);
  }

  public static async findOne(
    params: MgFilterQuery<ICarWithId>
  ): Promise<ICarWithId | null> {
    return Car.findOne(params);
  }

  public static async findAll(
    params: MgFilterQuery<ICarWithId>
  ): Promise<ICarWithId[]> {
    return Car.find(params);
  }
}

export default CarRepo;
