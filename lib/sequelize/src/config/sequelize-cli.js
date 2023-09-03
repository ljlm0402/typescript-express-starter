const { config } = require("dotenv");
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

module.exports = {
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
  host: DB_HOST,
  dialect: "mysql",
  migrationStorageTableName: "sequelize_migrations",
  seederStorageTableName: "sequelize_seeds",
};
