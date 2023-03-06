import { ICarWithId } from "../api/database/models/car";
import CarRepo from "../api/database/repository/car";
import UserRepo from "../api/database/repository/user";
import { NotFoundError } from "../core/ApiError";
import { CarStatus } from "../utils/enum";

class CarService {
  public static async unAssinedCars(): Promise<ICarWithId[] | null> {
    return CarRepo.findAll({ status: CarStatus.NOTASSIGNED });
  }
}

export default CarService;
