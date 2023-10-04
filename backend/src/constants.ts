import path from 'path';
import 'dotenv/config';

export const DataDir = path.resolve(__dirname, '..', 'data');
export const FrontendDir = path.resolve(__dirname, '..', 'frontend');

export const { DB_URI, PORT, JWT_SECRET, INIT_ID, INIT_PASSWD } = process.env;
