import express, {
  Application,
  json,
  Request,
  Response,
  urlencoded,
} from "express";
import eventLogger from "./services/eventLogger";
import cors from "cors";
import { environment, rabbitmqUrl } from "./config";
import amqplib, { Channel, Connection } from "amqplib";
import {
  generateRandomKmPoint,
  getRandomLocationInRandomState,
} from "./utils/geolocation";

process.on("uncaughtException", (e) => {
  eventLogger.logError(e.toString());
});

const app: Application = express();
app.use(cors());

export const port = 5000;

app.set("port", port);

app.use(urlencoded({ limit: "10mb", extended: false, parameterLimit: 10000 }));

app.use(json({ limit: "10mb" }));

let channel: Channel, connection: Connection;

connect();

async function connect() {
  try {
    const amqpServer = rabbitmqUrl || "";
    connection = await amqplib.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("addPoint");

    // consume all the onRide that are not acknowledged
    await channel.consume("onRide", async (data) => {
      const details = JSON.parse(data!.content.toString());
      const geolocation = await getRandomLocationInRandomState();
      const points = await generateRandomKmPoint();
      const pointsDetails = {
        userId: details.details.id,
        carId: details.details.carId,
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
        speed: points.km,
        point: points.point,
      };
      channel.sendToQueue(
        "addPoint",
        Buffer.from(
          JSON.stringify({
            pointsDetails,
            date: new Date(),
          })
        )
      );
      channel.ack(data!);
    });
  } catch (error) {
    console.log(error);
  }
}
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    environment,
    message: `Welcome to FMS Server heartbeat microservice Api.`,
  });
});

export default app;
