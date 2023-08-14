const dotenv = require("dotenv");
dotenv.config();

const config = {
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DB_HOST,
    host: process.env.DB4,
    dialect: "mysql",
  },
  test: {
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};

module.exports = config;
