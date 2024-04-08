import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.production.env'
      : '.development.env',
});

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
});
