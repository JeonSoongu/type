"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
router.get("/reset/password/:token", function (req, res) {
    res.render("reset-password");
});
exports.default = router;
