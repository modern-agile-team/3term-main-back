"use strict";
const maria = require("../../../config/maria");

class BoardStorage {
  static async findAllByBoard() {
    try {
      const query = `SELECT * FROM boards;`;
      return await maria.query(query);
    } catch (err) {
      throw {
        msg: "오류",
      };
    }
  }
}

module.exports = BoardStorage;
