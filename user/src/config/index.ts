import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

export const environment = process.env.NODE_ENV;
export const logDir = process.env.LOG_DIR;
export const port = process.env.PORT;
export const databaseUrl = process.env.DATABASE_URL;
export const jwtSecret = process.env.JWT_SECRET;
export const sentry = process.env.SENTRY_API;
export const rabbitmqUrl = process.env.RABBITMQ_URL;
