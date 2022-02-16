"use strict";

const BoardStorage = require("./BoardStorage");

class Board {
  constructor(req) {
    this.params = req.params;
    this.body = req.body;
    this.query = req.query;
  }

  async boardAll() {
    try {
      return await BoardStorage.findAllByBoard();
    } catch (err) {
      throw { msg: err.msg };
    }
  }
}

module.exports = Board;
