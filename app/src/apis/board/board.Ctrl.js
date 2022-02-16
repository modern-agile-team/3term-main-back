"use strict";

const Board = require("../../models/services/Board/Board");

const process = {
  all: async (req, res) => {
    try {
      const board = new Board(req);
      const response = await board.boardAll();

      return res.json(response);
    } catch (err) {
      return res.json(response);
    }
  },
};

module.exports = { process };
