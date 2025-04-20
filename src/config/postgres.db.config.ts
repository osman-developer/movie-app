import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default (): PostgresConnectionOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5433', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize:
    process.env.DB_SYNC === 'true' || process.env.NODE_ENV !== 'production',
});
