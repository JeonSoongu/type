"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql2");
var db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PSWORD,
    database: process.env.DB_DATABASE,
});
db.connect();
exports.default = db;
