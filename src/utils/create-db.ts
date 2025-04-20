import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function createDatabase() {
  const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

  const client = new Client({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: 'postgres', // Connect to default DB first
  });

  try {
    await client.connect();

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`,
    );
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`Database "${DB_NAME}" created.`);
    } else {
      console.log(`Database "${DB_NAME}" already exists.`);
    }
  } catch (err) {
    console.error(' Error creating database:', err);
  } finally {
    await client.end();
  }
}

createDatabase();
