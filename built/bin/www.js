"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("../app");
var logger_1 = require("../config/logger");
var PORT = Number(process.env.PORT) || 8080;
var application = app_1.default;
application
    .listen(PORT, function () { return logger_1.default.info(PORT + " \uD3EC\uD2B8\uC5D0\uC11C \uC11C\uBC84\uAC00 \uAC00\uB3D9\uB418\uC5C8\uC2B5\uB2C8\uB2E4."); })
    .on("error", function (err) { return console.error(err); });
