const { Client } = require("pg");
require("dotenv").config();

const con = new Client({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  port: process.env.DB_PORT || 5432,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

con.connect().then(() => console.log("connected"));

module.exports = { con };
