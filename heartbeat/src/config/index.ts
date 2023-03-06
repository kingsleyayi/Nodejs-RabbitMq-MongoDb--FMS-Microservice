import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });


export const environment = process.env.NODE_ENV;
export const logDir = process.env.LOG_DIR;
export const port = process.env.PORT;
export const rabbitmqUrl = process.env.RABBITMQ_URL