"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Error = /** @class */ (function () {
    function Error() {
    }
    Error.ctrl = function (msg, err) {
        return {
            isError: true,
            errMsg: err,
            clientMsg: msg,
        };
    };
    return Error;
}());
exports.default = Error;
