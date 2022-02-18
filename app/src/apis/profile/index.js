"use strict";

const express = require("express");
const profileCtrl = require("./profile.Ctrl");

const router = express.Router();

router.get("/:userNo", profileCtrl.process.lookUp);

module.exports = router;
