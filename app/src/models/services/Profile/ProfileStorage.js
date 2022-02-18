"use strict";
const maria = require("../../../config/maria");

class ProfileStorage {
  static async findProfile() {
    let conn;

    try {
      conn = await maria.getConnection();
      const query = `SELECT * FROM profiles`;

      return await conn.query(query);
    } catch (err) {
      throw {
        msg: "오류",
      };
    }
  }
}

module.exports = ProfileStorage;
