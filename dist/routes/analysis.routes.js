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
exports.analysisRouter = void 0;
var express_1 = require("express");
var AppError_1 = require("../errors/AppError");
var CreateCustomAnalysisService_1 = require("../services/analysis/CreateCustomAnalysisService");
var CreateMiningAnalysisService_1 = require("../services/analysis/CreateMiningAnalysisService");
var CreateDefaultAnalysisService_1 = require("../services/analysis/CreateDefaultAnalysisService");
var GetAnalysisService_1 = require("../services/analysis/GetAnalysisService");
var DeleteAnalysisService_1 = require("../services/analysis/DeleteAnalysisService");
var GetAnalysisHistoryService_1 = require("../services/analysis/GetAnalysisHistoryService");
var ListAnalysisService_1 = require("../services/analysis/ListAnalysisService");
var usersAuth_1 = require("../middlewares/usersAuth");
var analysisRouter = express_1.Router();
exports.analysisRouter = analysisRouter;
analysisRouter.get('/', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, videoId, videoTitle, channelTitle, listAnalysis, analysis;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = request.query, videoId = _a.videoId, videoTitle = _a.videoTitle, channelTitle = _a.channelTitle;
                listAnalysis = new ListAnalysisService_1.ListAnalysisService();
                analysis = [];
                if (!(typeof (videoId) === 'string' || typeof (videoId) === 'undefined')) return [3 /*break*/, 2];
                if (!(typeof (videoTitle) === 'string' || typeof (videoTitle) === 'undefined')) return [3 /*break*/, 2];
                if (!(typeof (channelTitle) === 'string' || typeof (channelTitle) === 'undefined')) return [3 /*break*/, 2];
                return [4 /*yield*/, listAnalysis.execute({ videoId: videoId, videoTitle: videoTitle, channelTitle: channelTitle })];
            case 1:
                analysis = _b.sent();
                _b.label = 2;
            case 2:
                if (analysis.length < 1) {
                    throw new AppError_1.AppError('No analysis found', 404);
                }
                return [2 /*return*/, response.json(analysis)];
        }
    });
}); });
// put ensureAuthenticated on release
analysisRouter.post('/', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, type, videoId, _c, usersMood, _d, mostCommentedWords, _e, messages, _f, save, userId, isToSave, _g, words, createAnalysis, getMood, getMostCommentedWords, getMessages, analysis, createAnalysis, getMostCommentedWords, analysis, createAnalysis, getMood, getMessages, analysis;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _a = request.query, _b = _a.type, type = _b === void 0 ? 'default' : _b, videoId = _a.videoId, _c = _a.usersMood, usersMood = _c === void 0 ? 'true' : _c, _d = _a.mostCommentedWords, mostCommentedWords = _d === void 0 ? 'true' : _d, _e = _a.messages, messages = _e === void 0 ? 'true' : _e, _f = _a.save, save = _f === void 0 ? 'false' : _f;
                userId = 1;
                isToSave = save === 'true';
                if (!(typeof (videoId) === 'string')) return [3 /*break*/, 6];
                _g = request.body.words, words = _g === void 0 ? [] : _g;
                if (!(type === 'custom')) return [3 /*break*/, 2];
                createAnalysis = new CreateCustomAnalysisService_1.CreateCustomAnalysisService();
                getMood = usersMood === 'true';
                getMostCommentedWords = mostCommentedWords === 'true';
                getMessages = messages === 'true';
                return [4 /*yield*/, createAnalysis.execute({ videoId: videoId, requestedWords: words, getMood: getMood, getMessages: getMessages, getMostCommentedWords: getMostCommentedWords, save: isToSave, userId: userId })];
            case 1:
                analysis = _h.sent();
                return [2 /*return*/, response.json(analysis)];
            case 2:
                if (!(type === 'mining')) return [3 /*break*/, 4];
                createAnalysis = new CreateMiningAnalysisService_1.CreateMiningAnalysisService();
                getMostCommentedWords = mostCommentedWords === 'true';
                return [4 /*yield*/, createAnalysis.execute({ videoId: videoId, requestedWords: words, getMostCommentedWords: getMostCommentedWords, save: isToSave, userId: userId })];
            case 3:
                analysis = _h.sent();
                return [2 /*return*/, response.json(analysis)];
            case 4:
                if (!(type === 'default')) return [3 /*break*/, 6];
                createAnalysis = new CreateDefaultAnalysisService_1.CreateDefaultAnalysisService();
                getMood = usersMood === 'true';
                getMessages = messages === 'true';
                return [4 /*yield*/, createAnalysis.execute({ videoId: videoId, getMood: getMood, getMessages: getMessages, save: isToSave, userId: userId })];
            case 5:
                analysis = _h.sent();
                return [2 /*return*/, response.json(analysis)];
            case 6: throw new AppError_1.AppError('Invalid query');
        }
    });
}); });
analysisRouter.get('/history', usersAuth_1.ensureAuthenticated, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, getHistory, history;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = request.user.id;
                getHistory = new GetAnalysisHistoryService_1.GetAnalysisHistoryService();
                return [4 /*yield*/, getHistory.execute({
                        userId: id
                    })];
            case 1:
                history = _a.sent();
                return [2 /*return*/, response.json(history)];
        }
    });
}); });
analysisRouter.get('/:id', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, getAnalysis, analysis;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = request.params.id;
                getAnalysis = new GetAnalysisService_1.GetAnalysisService();
                return [4 /*yield*/, getAnalysis.execute({ id: id })];
            case 1:
                analysis = _a.sent();
                return [2 /*return*/, response.json(analysis)];
        }
    });
}); });
analysisRouter["delete"]('/:id', usersAuth_1.ensureAuthenticated, usersAuth_1.ensureCanDeleteAnalysis, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var id, deleteAnalysis, deletedAnalysis;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = request.params.id;
                deleteAnalysis = new DeleteAnalysisService_1.DeleteAnalysisService();
                return [4 /*yield*/, deleteAnalysis.execute({ id: id })];
            case 1:
                deletedAnalysis = _a.sent();
                return [2 /*return*/, response.json(deletedAnalysis)];
        }
    });
}); });
//# sourceMappingURL=analysis.routes.js.map