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
exports.__esModule = true;
exports.usersRouter = void 0;
var express_1 = require("express");
var CreateUserService_1 = require("../services/user/CreateUserService");
var UpdateUserService_1 = require("../services/user/UpdateUserService");
var GetUserService_1 = require("../services/user/GetUserService");
var ListUserService_1 = require("../services/user/ListUserService");
var DeleteUserService_1 = require("../services/user/DeleteUserService");
// test
var GetVideoCommentsService_1 = require("../services/video/GetVideoCommentsService");
var getCommentCount_1 = require("../services/analysis/utils/comment/getCommentCount");
var getUsers_1 = require("../services/analysis/utils/comment/getUsers");
var getUserWithMostComment_1 = require("../services/analysis/utils/comment/getUserWithMostComment");
var getWords_1 = require("../services/analysis/utils/word/getWords");
var getJoinedWords_1 = require("../services/analysis/utils/word/getJoinedWords");
//
var usersAuth_1 = require("../middlewares/usersAuth");
var usersRouter = express_1.Router();
exports.usersRouter = usersRouter;
usersRouter.get('/:id', usersAuth_1.ensureAuthenticated, usersAuth_1.ensureIsTheUser, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, getUser, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = request.params.id;
                getUser = new GetUserService_1.GetUserService();
                return [4 /*yield*/, getUser.execute({
                        id: id
                    })];
            case 1:
                user = _a.sent();
                return [2 /*return*/, response.json(user)];
        }
    });
}); });
usersRouter.get('/', usersAuth_1.ensureAuthenticated, usersAuth_1.ensureIsAdmin, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var listUsers, users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                listUsers = new ListUserService_1.ListUserService();
                return [4 /*yield*/, listUsers.execute()];
            case 1:
                users = _a.sent();
                return [2 /*return*/, response.json(users)];
        }
    });
}); });
usersRouter.post('/', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var getComments, comments, users, userWithMostComment, words, joinedWords, commentCount, _a, email, password, name, createUser, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                getComments = new GetVideoCommentsService_1.GetVideoCommentsService();
                return [4 /*yield*/, getComments.execute({ videoId: '4L_aeAT9BAE' })];
            case 1:
                comments = (_b.sent()).comments;
                users = getUsers_1.getUsers({ comments: comments }).users;
                userWithMostComment = getUserWithMostComment_1.getUserWithMostComment({ users: users });
                words = getWords_1.getWords({ comments: comments, includeReplies: true }).words;
                joinedWords = getJoinedWords_1.getJoinedWords({ words: words }).joinedWords;
                commentCount = getCommentCount_1.getCommentCount({ comments: comments, includeReplies: false }).commentCount;
                return [2 /*return*/, response.json({ joinedWords: joinedWords })
                    //
                ];
            case 2:
                user = _b.sent();
                return [2 /*return*/, response.status(201).json(user)];
        }
    });
}); });
usersRouter.put('/:id', usersAuth_1.ensureAuthenticated, usersAuth_1.ensureIsTheUser, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, name, updateUser, updatedUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = request.params.id;
                name = request.body.name;
                updateUser = new UpdateUserService_1.UpdateUserService();
                return [4 /*yield*/, updateUser.execute({ id: id, name: name })];
            case 1:
                updatedUser = _a.sent();
                return [2 /*return*/, response.status(201).json(updatedUser)];
        }
    });
}); });
usersRouter["delete"]('/:id', usersAuth_1.ensureAuthenticated, usersAuth_1.ensureIsTheUser, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, deleteUser, deletedUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = request.params.id;
                deleteUser = new DeleteUserService_1.DeleteUserService();
                return [4 /*yield*/, deleteUser.execute({
                        id: id
                    })];
            case 1:
                deletedUser = _a.sent();
                return [2 /*return*/, response.json(deletedUser)];
        }
    });
}); });
//# sourceMappingURL=users.routes.js.map