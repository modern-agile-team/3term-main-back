"use strict";
const db = require("mariadb");

const { DB_HOST, DB_USER, DB_PSWORD, DB_DATABASE } = process.env;

const maria = db.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PSWORD,
  database: DB_DATABASE,
});

module.exports = maria;
