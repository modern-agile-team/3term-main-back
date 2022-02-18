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
      return await ProfileStorage.findProfile();
    } catch (err) {
      throw { msg: err.msg };
    }
  }
}

module.exports = Profile;
