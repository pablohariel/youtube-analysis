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
exports.GetVideoDataService = void 0;
var googleapis_1 = require("googleapis");
var AppError_1 = require("../../errors/AppError");
var service = googleapis_1.google.youtube('v3');
var GetVideoDataService = /** @class */ (function () {
    function GetVideoDataService() {
    }
    GetVideoDataService.prototype.execute = function (_a) {
        var _b, _c;
        var videoId = _a.videoId;
        return __awaiter(this, void 0, void 0, function () {
            var videoReponse, video, snippet, statistics, contentDetails, videoData, title, publishedAt, channelId, description, defaultLanguage, thumbnails, channelTitle, caption, duration, definition, viewCount, likeCount, dislikeCount, commentCount, favoriteCount, channelIdChecked, channelResponse, channelSnippet, channelThumbnails, err_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, service.videos.list({
                                key: process.env.API_KEY,
                                part: ['snippet', 'contentDetails', 'statistics'],
                                id: [videoId]
                            })];
                    case 1:
                        videoReponse = _d.sent();
                        if (!(videoReponse.data.items !== undefined)) return [3 /*break*/, 4];
                        video = videoReponse.data.items[0];
                        snippet = video.snippet, statistics = video.statistics, contentDetails = video.contentDetails;
                        videoData = {};
                        if (!(snippet && contentDetails && statistics)) return [3 /*break*/, 3];
                        title = snippet.title, publishedAt = snippet.publishedAt, channelId = snippet.channelId, description = snippet.description, defaultLanguage = snippet.defaultLanguage, thumbnails = snippet.thumbnails, channelTitle = snippet.channelTitle;
                        caption = contentDetails.caption, duration = contentDetails.duration, definition = contentDetails.definition;
                        viewCount = statistics.viewCount, likeCount = statistics.likeCount, dislikeCount = statistics.dislikeCount, commentCount = statistics.commentCount, favoriteCount = statistics.favoriteCount;
                        videoData.title = title || '';
                        videoData.description = description || undefined;
                        videoData.thumbnail = ((_b = thumbnails === null || thumbnails === void 0 ? void 0 : thumbnails.high) === null || _b === void 0 ? void 0 : _b.url) || '';
                        videoData.details = {
                            caption: '',
                            definition: '',
                            duration: ''
                        };
                        videoData.details.duration = duration || '';
                        videoData.details.definition = definition || '';
                        videoData.details.caption = caption || '';
                        videoData.statistics = {
                            commentCount: '',
                            dislikeCount: '',
                            favoriteCount: '',
                            likeCount: '',
                            viewCount: ''
                        };
                        videoData.statistics.viewCount = viewCount || '';
                        videoData.statistics.likeCount = likeCount || '';
                        videoData.statistics.dislikeCount = dislikeCount || '';
                        videoData.statistics.commentCount = commentCount || '';
                        videoData.statistics.favoriteCount = favoriteCount || '';
                        videoData.channelDetails = {
                            id: '',
                            thumbnail: '',
                            title: ''
                        };
                        channelIdChecked = channelId || '';
                        return [4 /*yield*/, service.channels.list({
                                key: process.env.API_KEY,
                                part: ['snippet'],
                                id: [channelIdChecked]
                            })];
                    case 2:
                        channelResponse = _d.sent();
                        if (channelResponse.data.items) {
                            channelSnippet = channelResponse.data.items[0].snippet;
                            if (channelSnippet) {
                                channelThumbnails = channelSnippet.thumbnails;
                                videoData.channelDetails.thumbnail = ((_c = channelThumbnails === null || channelThumbnails === void 0 ? void 0 : channelThumbnails.high) === null || _c === void 0 ? void 0 : _c.url) || '';
                            }
                        }
                        videoData.channelDetails.id = channelId || '';
                        videoData.channelDetails.title = channelTitle || '';
                        videoData.defaultLanguage = defaultLanguage || '';
                        videoData.published_at = publishedAt || '';
                        _d.label = 3;
                    case 3: return [2 /*return*/, { videoData: videoData }];
                    case 4: throw new AppError_1.AppError('Video not found.');
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        err_1 = _d.sent();
                        console.error(err_1);
                        throw new AppError_1.AppError('Video not found.');
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return GetVideoDataService;
}());
exports.GetVideoDataService = GetVideoDataService;
//# sourceMappingURL=GetVideoDataService.js.map