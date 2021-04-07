"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var CommentStorage_1 = require("./CommentStorage");
var Error_1 = require("../../../utils/Error");
var Comment = /** @class */ (function () {
    function Comment(req) {
        this.req = req;
        this.body = req.body;
        this.params = req.params;
    }
    Comment.prototype.createByBoardNum = function () {
        return __awaiter(this, void 0, void 0, function () {
            var body, boardNum, _a, isCreate, num, comments, comment, createdComments, isUpdate, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        body = this.body;
                        boardNum = this.params.num;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, CommentStorage_1.default.createByBoardNum(body, boardNum)];
                    case 2:
                        _a = _b.sent(), isCreate = _a.isCreate, num = _a.num;
                        if (!isCreate) return [3 /*break*/, 5];
                        return [4 /*yield*/, CommentStorage_1.default.findOneByNum(num)];
                    case 3:
                        comments = _b.sent();
                        comment = Object.values(JSON.parse(JSON.stringify(comments)));
                        createdComments = comment[0];
                        return [4 /*yield*/, CommentStorage_1.default.updateGroupNum(createdComments.num)];
                    case 4:
                        isUpdate = _b.sent();
                        if (isUpdate) {
                            createdComments.groupNum = createdComments.num;
                            return [2 /*return*/, { success: true, msg: "댓글 생성 성공", createdComments: createdComments }];
                        }
                        return [2 /*return*/, {
                                success: false,
                                msg: "댓글 Group Number 업데이트 실패. 서버 개발자에게 문의 바랍니다.",
                            }];
                    case 5: return [2 /*return*/, { success: false, msg: "댓글 생성 실패" }];
                    case 6:
                        err_1 = _b.sent();
                        return [2 /*return*/, Error_1.default.ctrl("서버 에러입니다. 서버 개발자에게 문의해주세요.", err_1)];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Comment.prototype.createReplyByGroupNum = function () {
        return __awaiter(this, void 0, void 0, function () {
            var body, boardNum, groupNum, _a, isCreate, num, isUpdateReplyFlag, replies, reply, createdReply, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        body = this.body;
                        boardNum = this.params.num;
                        groupNum = this.params.groupNum;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, CommentStorage_1.default.createReplyByGroupNum(body, boardNum, groupNum)];
                    case 2:
                        _a = _b.sent(), isCreate = _a.isCreate, num = _a.num;
                        if (!isCreate) return [3 /*break*/, 5];
                        return [4 /*yield*/, CommentStorage_1.default.updateReplyFlagOfCommentByGroupNum(groupNum)];
                    case 3:
                        isUpdateReplyFlag = _b.sent();
                        if (!isUpdateReplyFlag) return [3 /*break*/, 5];
                        return [4 /*yield*/, CommentStorage_1.default.findOneByNum(num)];
                    case 4:
                        replies = _b.sent();
                        reply = Object.values(JSON.parse(JSON.stringify(replies)));
                        createdReply = reply[0];
                        return [2 /*return*/, { success: true, msg: "답글 생성 성공", createdReply: createdReply }];
                    case 5: return [2 /*return*/, { success: false, msg: "답글 생성 실패" }];
                    case 6:
                        err_2 = _b.sent();
                        return [2 /*return*/, Error_1.default.ctrl("서버 에러입니다. 서버 개발자에게 문의해주세요.", err_2)];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Comment.prototype.updateByNum = function () {
        return __awaiter(this, void 0, void 0, function () {
            var commentNum, body, isUpdate, comments, comment, updatedComment, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        commentNum = this.params.commentNum;
                        body = this.body;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, CommentStorage_1.default.updateByNum(body, commentNum)];
                    case 2:
                        isUpdate = _a.sent();
                        if (!(isUpdate === 1)) return [3 /*break*/, 4];
                        return [4 /*yield*/, CommentStorage_1.default.findOneByNum(commentNum)];
                    case 3:
                        comments = _a.sent();
                        comment = Object.values(JSON.parse(JSON.stringify(comments)));
                        updatedComment = comment[0];
                        return [2 /*return*/, {
                                success: true,
                                msg: "댓글 수정 성공",
                                updatedComment: updatedComment.depth ? undefined : updatedComment,
                                updatedReply: updatedComment.depth ? updatedComment : undefined, // depth가 0이면 댓글이므로 undefined를 반환하여 해당 키가 응답되지 않도록 한다.
                            }];
                    case 4: return [2 /*return*/, {
                            success: false,
                            msg: "댓글을 수정한 studentId와 수정될 commentNum이 올바른지 확인하십시오.",
                        }];
                    case 5:
                        err_3 = _a.sent();
                        return [2 /*return*/, Error_1.default.ctrl("서버 에러입니다. 서버 개발자에게 문의해주세요.", err_3)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Comment.prototype.deleteCommentByNum = function () {
        return __awaiter(this, void 0, void 0, function () {
            var num, replyFlag, isDelete, isUpdateHidden, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        num = this.params.commentNum;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, CommentStorage_1.default.findReplyFlag(num)];
                    case 2:
                        replyFlag = _a.sent();
                        isDelete = 0;
                        if (!(replyFlag === 1)) return [3 /*break*/, 4];
                        return [4 /*yield*/, CommentStorage_1.default.updatehiddenFlag(num)];
                    case 3:
                        isUpdateHidden = _a.sent();
                        if (isUpdateHidden) {
                            return [2 /*return*/, {
                                    success: true,
                                    msg: "댓글 숨김 처리",
                                    deletedCommentNum: num,
                                }];
                        }
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, CommentStorage_1.default.deleteCommentByNum(num)];
                    case 5:
                        // 답글이 없으면 삭제
                        isDelete = _a.sent();
                        _a.label = 6;
                    case 6:
                        if (isDelete === 1) {
                            return [2 /*return*/, {
                                    success: true,
                                    msg: "댓글 삭제 성공",
                                    deletedCommentNum: num,
                                }];
                        }
                        return [2 /*return*/, {
                                success: false,
                                msg: "답글을 삭제하려면 depth가 1이어야 합니다. 댓글을 삭제하려는 것이 맞다면 댓글 번호가 올바른지 확인해 주십시오.",
                            }];
                    case 7:
                        err_4 = _a.sent();
                        return [2 /*return*/, Error_1.default.ctrl("서버 에러입니다. 서버 개발자에게 문의해주세요.", err_4)];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Comment.prototype.deleteReplyByNum = function () {
        return __awaiter(this, void 0, void 0, function () {
            var num, studentId, groupNum, isDelete, replyFlag, hiddenFlag, isDeleteHidden, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        num = this.params.commentNum;
                        studentId = this.body.studentId;
                        return [4 /*yield*/, CommentStorage_1.default.findOneGroupNum(num)];
                    case 1:
                        groupNum = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 8, , 9]);
                        return [4 /*yield*/, CommentStorage_1.default.deleteReplyByNum(num, studentId)];
                    case 3:
                        isDelete = _a.sent();
                        return [4 /*yield*/, CommentStorage_1.default.updateReplyFlag(groupNum)];
                    case 4:
                        replyFlag = _a.sent();
                        if (!(replyFlag === 1)) return [3 /*break*/, 7];
                        return [4 /*yield*/, CommentStorage_1.default.findOneHiddenFlag(groupNum)];
                    case 5:
                        hiddenFlag = _a.sent();
                        if (!(hiddenFlag === 1)) return [3 /*break*/, 7];
                        return [4 /*yield*/, CommentStorage_1.default.deleteHiddenComment(groupNum)];
                    case 6:
                        isDeleteHidden = _a.sent();
                        if (isDeleteHidden) {
                            return [2 /*return*/, {
                                    success: true,
                                    msg: "답글 삭제 및 숨김 댓글 삭제",
                                    deletedCommentNum: groupNum,
                                    deletedReplyNum: num, // 삭제된 답글의 정보도 응답한다.
                                }];
                        }
                        _a.label = 7;
                    case 7:
                        if (isDelete === 1) {
                            return [2 /*return*/, {
                                    success: true,
                                    msg: "답글 삭제 성공",
                                    deletedReplyNum: num,
                                }];
                        }
                        return [2 /*return*/, {
                                success: false,
                                msg: "댓글을 삭제하려면 depth가 0이어야 합니다. 답글을 삭제하려는 것이 맞다면 답글 번호가 올바른지 확인해 주십시오.",
                            }];
                    case 8:
                        err_5 = _a.sent();
                        return [2 /*return*/, Error_1.default.ctrl("서버 에러입니다. 서버 개발자에게 문의해주세요.", err_5)];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Comment.prototype.findStudentIdByNum = function () {
        return __awaiter(this, void 0, void 0, function () {
            var boardNum, buyers, buyer, findBuyer, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        boardNum = this.params.num;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, CommentStorage_1.default.findStudentIdByNum(boardNum)];
                    case 2:
                        buyers = _a.sent();
                        buyer = Object.values(JSON.parse(JSON.stringify(buyers)));
                        findBuyer = buyer[0];
                        return [2 /*return*/, { success: true, msg: "comments조회 완료 되었습니다.", findBuyer: findBuyer }];
                    case 3:
                        err_6 = _a.sent();
                        return [2 /*return*/, Error_1.default.ctrl("서버 에러입니다. 서버 개발자에게 문의해주세요.", err_6)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Comment;
}());
exports.default = Comment;
