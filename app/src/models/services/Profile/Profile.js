"use strict";

const ProfileStorage = require("./ProfileStorage");

class Profile {
  constructor(req) {
    this.params = req.params;
    this.body = req.body;
    this.query = req.query;
  }

  async oneLookUp() {
    try {
      const userNo = this.params;

      return await ProfileStorage.findProfile(userNo);
    } catch (err) {
      throw { msg: err.msg };
    }
  }
}

module.exports = Profile;
