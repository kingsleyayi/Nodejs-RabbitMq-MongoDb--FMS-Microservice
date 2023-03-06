import { IPoint, IPointWithId, Point } from "../models/points";
import { MgFilterQuery } from "./mongoofe.types";

class PointRepo {
  public static async create(point: IPoint): Promise<IPointWithId> {
    return await Point.create(point);
  }

  public static async findAll(
    params: MgFilterQuery<IPointWithId>
  ): Promise<IPointWithId[] | null> {
    return Point.find(params);
  }
}

export default PointRepo;
