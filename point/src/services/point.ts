import amqplib, { Channel, Connection } from "amqplib";
import { IPoint, IPointWithId } from "../api/database/models/points";
import PointRepo from "../api/database/repository/point.repo";
import { rabbitmqUrl } from "../config";
import { MyReq } from "../types/Request";

let channel: Channel, connection: Connection;

export async function connect() {
  try {
    const amqpServer = rabbitmqUrl || "";
    connection = await amqplib.connect(amqpServer);
    channel = await connection.createChannel();

    await channel.consume("addPoint", async (data) => {
      const details = JSON.parse(data!.content.toString());
      const pointDetails: IPoint = {
        carId: details.pointsDetails.carId,
        userId: details.pointsDetails.userId,
        latitude: details.pointsDetails.latitude,
        longitude: details.pointsDetails.longitude,
        speed: details.pointsDetails.speed,
        point: details.pointsDetails.point,
      };
      await PointRepo.create(pointDetails);
      channel.ack(data!);
      return details;
    });
  } catch (error) {
    console.log(error);
  }
}

class PointService {
  public static async userPoints(req: MyReq) {
    const userId = req.user?.id;
    const points = await PointRepo.findAll({ userId : userId });
    return {
      points,
    };
  }
}

export default PointService;
