import express, {
  Application,
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from "express";
import eventLogger from "./services/eventLogger";
import cors from "cors";
import { environment, sentry } from "./config";
import { connectDatabase } from "./config/database";
import router from "./api/routes";
import { ApiError, InternalError, NotFoundError } from "./core/ApiError";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { insertCars } from "./api/database/seeder/car.seeder";
import UserService, { connect } from "./services/user";
import cron from "node-cron";

process.on("uncaughtException", (e) => {
  eventLogger.logError(e.toString());
});

const app: Application = express();
app.use(cors());

export const port = 4000;

app.set("port", port);

Sentry.init({
  dsn: sentry,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  tracesSampleRate: 1.0,
});

app.use(urlencoded({ limit: "10mb", extended: false, parameterLimit: 10000 }));

app.use(json({ limit: "10mb" }));

// connect to rabbitmq
connect();



app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    environment,
    message: `Welcome to FMS Server Api.`,
  });
});

connectDatabase();

insertCars();
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(router);

app.use((req, res, next) => next(new NotFoundError()));

//get users on ride cronjob
cron.schedule('*/10 * * * * *', () => {
  UserService.getUsersOnRide()
});
// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());
// Debug Build
//custom error handler for all routes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else {
    if (environment === "development") {
      eventLogger.logError(err.toString());
      return res.status(500).send(err.message);
    }
    ApiError.handle(new InternalError(), res);
  }
});


export default app;
