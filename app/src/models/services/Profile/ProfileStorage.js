"use strict";
const maria = require("../../../config/maria");

class ProfileStorage {
  static async findProfile({ userNo }) {
    let conn;

    try {
      conn = await maria.getConnection();
      const query = `
        SELECT nickname, 
          (SELECT name FROM schools WHERE no = school_no) AS school, 
          (SELECT name FROM majors WHERE no = major_no) AS major, 
          (SELECT COUNT(*) FROM boards WHERE user_no = users.no) AS cntBoard,
          thumb, photo_url, DATE_FORMAT(in_date, "%Y-%m-%d") AS inDate 
        FROM users 
        WHERE no = ?`;

      return await conn.query(query, [userNo]);
    } catch (err) {
      throw {
        msg: "오류",
      };
    }
  }
}

module.exports = ProfileStorage;
