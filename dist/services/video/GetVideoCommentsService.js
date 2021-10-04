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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.GetVideoCommentsService = void 0;
var googleapis_1 = require("googleapis");
var AppError_1 = require("../../errors/AppError");
var service = googleapis_1.google.youtube('v3');
var GetVideoCommentsService = /** @class */ (function () {
    function GetVideoCommentsService() {
    }
    GetVideoCommentsService.prototype.execute = function (_a) {
        var _b, _c;
        var videoId = _a.videoId;
        return __awaiter(this, void 0, void 0, function () {
            var pageToken, apiComments, response, response, err_1, comments, _i, apiComments_1, item, commentData, snippet, textDisplay, likeCount, authorDisplayName, authorProfileImageUrl, authorChannelId, publishedAt, totalReplyCount, replies, filteredReplies, finalReplies, comment;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        pageToken = null;
                        apiComments = [];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 8, , 9]);
                        _d.label = 2;
                    case 2:
                        if (!!pageToken) return [3 /*break*/, 4];
                        return [4 /*yield*/, service.commentThreads.list({
                                key: process.env.API_KEY,
                                part: ['id', 'snippet', 'replies'],
                                videoId: videoId,
                                maxResults: 100
                            })];
                    case 3:
                        response = _d.sent();
                        pageToken = response.data.nextPageToken;
                        if (response.data.items !== undefined) {
                            apiComments = __spreadArray(__spreadArray([], apiComments), response.data.items);
                        }
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, service.commentThreads.list({
                            key: process.env.API_KEY,
                            part: ['snippet'],
                            videoId: videoId,
                            pageToken: pageToken,
                            maxResults: 100
                        })];
                    case 5:
                        response = _d.sent();
                        pageToken = response.data.nextPageToken;
                        if (response.data.items !== undefined) {
                            apiComments = __spreadArray(__spreadArray([], apiComments), response.data.items);
                        }
                        _d.label = 6;
                    case 6:
                        if (pageToken) return [3 /*break*/, 2];
                        _d.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_1 = _d.sent();
                        throw new AppError_1.AppError('Video not found.');
                    case 9:
                        comments = [];
                        for (_i = 0, apiComments_1 = apiComments; _i < apiComments_1.length; _i++) {
                            item = apiComments_1[_i];
                            if (item) {
                                commentData = (_c = (_b = item.snippet) === null || _b === void 0 ? void 0 : _b.topLevelComment) === null || _c === void 0 ? void 0 : _c.snippet;
                                snippet = item.snippet;
                                if (commentData && snippet) {
                                    textDisplay = commentData.textDisplay, likeCount = commentData.likeCount, authorDisplayName = commentData.authorDisplayName, authorProfileImageUrl = commentData.authorProfileImageUrl, authorChannelId = commentData.authorChannelId, publishedAt = commentData.publishedAt;
                                    totalReplyCount = snippet.totalReplyCount;
                                    replies = item.replies;
                                    filteredReplies = (replies === null || replies === void 0 ? void 0 : replies.comments) || [];
                                    finalReplies = filteredReplies.map(function (item) {
                                        var _a, _b, _c, _d, _e, _f;
                                        return {
                                            content: ((_a = item.snippet) === null || _a === void 0 ? void 0 : _a.textDisplay) || '',
                                            author: {
                                                id: ((_b = item.snippet) === null || _b === void 0 ? void 0 : _b.authorChannelId) || '',
                                                name: ((_c = item.snippet) === null || _c === void 0 ? void 0 : _c.authorDisplayName) || '',
                                                profileImage: ((_d = item.snippet) === null || _d === void 0 ? void 0 : _d.authorProfileImageUrl) || ''
                                            },
                                            likeCount: ((_e = item.snippet) === null || _e === void 0 ? void 0 : _e.likeCount) || 0,
                                            published_at: ((_f = item.snippet) === null || _f === void 0 ? void 0 : _f.publishedAt) || ''
                                        };
                                    });
                                    comment = {
                                        content: textDisplay || '',
                                        author: {
                                            id: (authorChannelId === null || authorChannelId === void 0 ? void 0 : authorChannelId.value) || '',
                                            name: authorDisplayName || '',
                                            profileImage: authorProfileImageUrl || ''
                                        },
                                        likeCount: likeCount || 0,
                                        replyCount: totalReplyCount || 0,
                                        replies: finalReplies || [],
                                        published_at: publishedAt || ''
                                    };
                                    comments.push(comment);
                                }
                            }
                        }
                        return [2 /*return*/, { comments: comments }];
                }
            });
        });
    };
    return GetVideoCommentsService;
}());
exports.GetVideoCommentsService = GetVideoCommentsService;
//# sourceMappingURL=GetVideoCommentsService.js.map