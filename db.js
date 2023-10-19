/** Database config for database. */


const { Client } = require("pg");

let db = new Client({
  connectionString: "postgres://tya:password@localhost:5432/books"
});

db.connect();


module.exports = db;
