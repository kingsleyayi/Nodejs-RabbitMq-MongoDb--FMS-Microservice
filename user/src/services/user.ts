import { Request } from "express";
import { IUserWithId } from "../api/database/models/user";
import CarRepo from "../api/database/repository/car";
import UserRepo from "../api/database/repository/user";
import { BadRequestError, NotFoundError } from "../core/ApiError";
import { jwtPayload } from "../types/jwt";
import { MyReq } from "../types/Request";
import { IUserWithToken } from "../types/user";
import { CarStatus, Status } from "../utils/enum";
import { generateToken } from "../utils/jwt";
import { checkPassword, hashPassword } from "../utils/password";
import eventLogger from "./eventLogger";

import amqplib, { Channel, Connection } from "amqplib";
import { rabbitmqUrl } from "../config";

let channel: Channel, connection: Connection;

export async function connect() {
  try {
    const amqpServer = rabbitmqUrl || "";
    connection = await amqplib.connect(amqpServer);
    channel = await connection.createChannel();

    await channel.assertQueue("onRide");
  } catch (error) {
    console.log(error);
  }
}

class UserService {
  public static async userRegistration(req: MyReq): Promise<IUserWithId> {
    const { name, email, password, address } = req.body;
    const userData = await UserRepo.findOne({ email });

    if (userData) {
      throw new BadRequestError(" User Already Exist");
    }
    const hashedPassword = await hashPassword(password);

    let userValue: object = {
      name: name,
      email: email,
      password: hashedPassword,
      address: address,
    };

    const data: IUserWithId | null = await UserRepo.create(userValue);
    return data as IUserWithId;
  }

  public static async getToken(user: jwtPayload): Promise<string> {
    return generateToken(user);
  }

  public static async loginUser(req: MyReq): Promise<IUserWithToken> {
    const { email, password } = req.body;

    const userData = await UserRepo.findOne({ email });
    if (!userData) {
      throw new NotFoundError("Account does not exist");
    }
    const isMatch = await checkPassword(password, userData.password!);
    if (isMatch == false) {
      throw new NotFoundError("Inccorect Email Or Password");
    }
    const tokenDetail: jwtPayload = {
      id: userData._id.toString(),
      email: userData.email!,
    };
    const token = await this.getToken(tokenDetail);
    return { user: userData, token };
  }

  public static async userData(req: MyReq) {
    const user = req.user;
    if (!user) throw new NotFoundError(" user not found");

    const users = await UserRepo.userData({ _id: user._id });
    if (!users) throw new NotFoundError("user not found");
    return {
      user: users,
    };
  }

  public static async assignCar(
    userId: string,
    carId: string
  ): Promise<{ message: string }> {
    try {
      const car = await CarRepo.findOne({ _id: carId });
      if (!car) {
        throw new BadRequestError("Invalid car id");
      }


      const user = await UserRepo.findOne({ _id: userId });
      if (!user) {
        throw new BadRequestError("Invalid user id");
      }

      if(user.carId){
        throw ("car already assigned to this user");
      }

      await UserRepo.update(userId, { carId: carId });

      // Update car's status
      await CarRepo.update(carId, { status: CarStatus.ASSIGNED });

      return { message: "successful" };
    } catch (error) {
      throw new BadRequestError(error as string);
    }
  }

  public static async UpdateUserStatus(
    req: Request
  ): Promise<{ message: string }> {
    try {
      const userId = req.user?._id.toString() || "";
      const status = req.params.status;
      const user = await UserRepo.findOne({ _id: userId });
      if (!user) {
        throw new BadRequestError("Invalid user id");
      }
      if (!user.carId) {
        throw new BadRequestError(
          "car has not been assigned to this user to start ride"
        );
      }
      if (status !== Status.ONRIDE && status !== Status.ACTIVE) {
        throw new BadRequestError("Invalid status");
      }

      await UserRepo.update(userId, { status: status });
      return { message: "successful" };
    } catch (error) {
      throw new BadRequestError("failed to update status");
    }
  }

  public static async getUsersOnRide() {
    const users = await UserRepo.findAll({ status: Status.ONRIDE });
    if (users !== null) {
      for (const user of users) {
        const details = {
          id: user._id,
          carId: user.carId,
        };

        channel.sendToQueue(
          "onRide",
          Buffer.from(
            JSON.stringify({
              details,
              date: new Date(),
            })
          )
        );
      }
    }
  }
}

export default UserService;
