"use strict";

const Profile = require("../../models/services/Profile/Profile");

const process = {
  lookUp: async (req, res) => {
    try {
      const profile = new Profile(req);
      const response = await profile.oneLookUp();
      return res.json(response);
    } catch (err) {
      return res.json(err);
    }
  },
};

module.exports = { process };
