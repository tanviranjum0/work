const pg = require("pg");
const { password } = require("pg/lib/defaults");
// const { database } = require("pg/lib/defaults");
// const { port } = require("pg/lib/defaults");
const { Pool } = pg;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "postgres",
  port: 5432,
  database: "bookdb",
});
// pool.connect();
module.exports = pool;
