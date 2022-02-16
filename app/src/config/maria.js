"use strict";
const maria = require("mariadb");

const { DB_HOST, DB_USER, DB_PSWORD, DB_DATABASE } = process.env;

const db = maria.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PSWORD,
  database: DB_DATABASE,
});

// db.connect();

module.exports = db;
