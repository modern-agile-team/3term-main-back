"use strict";
const maria = require("../../../config/maria");

class BoardStorage {
  static async findAllByBoard() {
    let conn;

    try {
      conn = await maria.getConnection();
      const query = `SELECT * FROM boards`;

      return await conn.query(query);
    } catch (err) {
      throw {
        msg: "오류",
      };
    }
  }
}

module.exports = BoardStorage;
