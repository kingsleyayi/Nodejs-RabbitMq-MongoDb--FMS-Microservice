import { Types } from "mongoose";
import { IUser, IUserWithId, User } from "../models/user";
import { MgFilterQuery, MgUpdateQuery } from "./mongoofe.types";

class UserRepo {
  public static async create(user: IUser): Promise<IUserWithId> {
    return await User.create(user);
  }

  public static async update(
    userId: string,
    update: MgUpdateQuery<IUserWithId>
  ): Promise<IUserWithId | null> {
    return User.findOneAndUpdate({ _id: userId }, update);
  }

  public static async findOne(
    params: MgFilterQuery<IUserWithId>
  ): Promise<IUserWithId | null> {
    return User.findOne(params);
  }

  public static async findAll(
    params: MgFilterQuery<IUserWithId>
  ): Promise<IUserWithId[] | null> {
    return User.find(params);
  }

  public static async userData(
    params: MgFilterQuery<IUserWithId>
  ): Promise<IUserWithId | null> {
    const userAggregate = User.aggregate([
      { $match: params },
      {
        $lookup: {
          from: "cars",
          localField: "carId",
          foreignField: "_id",
          as: "carDetails",
        },
      },
      {
        $addFields: {
          carDetails: { $arrayElemAt: ["$carDetails", 0] },
        },
      },
    ]);
    const userData = await userAggregate.exec();

    if (userData.length === 0) {
      return null;
    }

    const user = userData[0];
    // Rename the '_id' property to 'id'
    user.id = user._id;
    delete user._id;

    return user;
  }
}

export default UserRepo;
