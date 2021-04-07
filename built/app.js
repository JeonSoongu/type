"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var dotenv = require("dotenv");
var cors = require("cors");
var morgan = require("morgan");
var logger_1 = require("./config/logger");
var app = express();
dotenv.config();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/src/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(morgan("tiny", { stream: { write: function (message) { return logger_1.default.info(message); } } }));
var index_1 = require("./apis/view/index");
var boards_1 = require("./apis/boards");
app.use("/", index_1.default);
app.use("/api/boards", boards_1.default);
exports.default = app;
