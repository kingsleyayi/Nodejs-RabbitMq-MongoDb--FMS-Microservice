import { v4 as uuidv4 } from "uuid";
import eventLogger from "../../../services/eventLogger";
import { Car, ICarWithId } from "../models/car";

const popularBrands = [
  "Toyota Supra",
  "Lamborghini Huracan",
  "Ford Mustang",
  "Nissan GTR",
  "Tesla Model S",
];

export async function insertCars() {
  const count = await Car.countDocuments();
  if (count > 0) {
    eventLogger.logInfo("Cars Have Already Been Added");
    return;
  }

  const cars: Partial<ICarWithId>[] = [];
  for (let i = 0; i < 10; i++) {
    const car: Partial<ICarWithId> = {
      brand: popularBrands[Math.floor(Math.random() * popularBrands.length)],
      ref: uuidv4(),
    };
    cars.push(car);
  }

  try {
    await Car.insertMany(cars);
    eventLogger.logInfo("Cars inserted successfully");
  } catch (err) {
    eventLogger.logError("Error inserting cars:" + err);
  }
}