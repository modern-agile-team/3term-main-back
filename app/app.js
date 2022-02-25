"use strict";

const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 경로 지정
const board = require("./src/apis/board");
const profile = require("./src/apis/profile");

// API 연결
app.use("/board", board);
app.use("/profile", profile);

module.exports = app;
