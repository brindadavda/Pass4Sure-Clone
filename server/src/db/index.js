import pg from "pg";
import 'dotenv/config'; // <-- this automatically loads .env
import dotenv from 'dotenv';


dotenv.config(); // loads .env variables into process.env


const { Pool } = pg;

console.log("Database URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false
});

// This is the important part — ensure these are exported
export const query = (text, params) => pool.query(text, params);
export const getClient = () => pool.connect();
