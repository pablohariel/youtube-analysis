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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.ensureCanDeleteAnalysis = exports.ensureIsTheUser = exports.ensureIsAdmin = exports.ensureAuthenticated = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var bson_1 = require("bson");
var connection_1 = require("../database/connection");
var auth_1 = __importDefault(require("../config/auth"));
var AppError_1 = require("../errors/AppError");
var ensureAuthenticated = function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, _a, token, _b, secret, decode, id, user, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                authHeader = request.headers.authorization;
                if (!authHeader) {
                    throw new AppError_1.AppError('JWT token is missing', 401);
                }
                _a = authHeader.split(' '), token = _a[1];
                _b = auth_1["default"].jwt.secret, secret = _b === void 0 ? '' : _b;
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, , 4]);
                decode = jsonwebtoken_1.verify(token, secret);
                id = decode.id;
                return [4 /*yield*/, connection_1.prisma.user.findUnique({
                        where: {
                            id: id
                        }
                    })];
            case 2:
                user = _d.sent();
                if (!user) {
                    throw new AppError_1.AppError('Invalid JWT token', 401);
                }
                request.user = {
                    id: String(id),
                    isAdmin: user.isAdmin
                };
                return [2 /*return*/, next()];
            case 3:
                _c = _d.sent();
                throw new AppError_1.AppError('Invalid JWT token', 401);
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.ensureAuthenticated = ensureAuthenticated;
var ensureIsAdmin = function (request, response, next) {
    var isAdmin = request.user.isAdmin;
    if (!isAdmin) {
        throw new AppError_1.AppError('Access denied', 401);
    }
    return next();
};
exports.ensureIsAdmin = ensureIsAdmin;
var ensureIsTheUser = function (request, response, next) {
    var _a = request.user, userId = _a.id, isAdmin = _a.isAdmin;
    var id = request.params.id;
    if (userId !== id && !isAdmin) {
        throw new AppError_1.AppError('Access denied', 401);
    }
    return next();
};
exports.ensureIsTheUser = ensureIsTheUser;
var ensureCanDeleteAnalysis = function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, isAdmin, analysisId, analysis;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = request.user, userId = _a.id, isAdmin = _a.isAdmin;
                analysisId = request.params.id;
                try {
                    analysisId = new bson_1.ObjectId(analysisId).toHexString();
                }
                catch (error) {
                    throw new AppError_1.AppError('Analysis not found');
                }
                return [4 /*yield*/, connection_1.prisma.analysis.findUnique({
                        where: {
                            id: analysisId
                        }
                    })];
            case 1:
                analysis = _b.sent();
                if (!analysis) {
                    throw new AppError_1.AppError('Analysis not found');
                }
                if (analysis.userId !== userId && !isAdmin) {
                    throw new AppError_1.AppError('Access denied', 401);
                }
                return [2 /*return*/, next()];
        }
    });
}); };
exports.ensureCanDeleteAnalysis = ensureCanDeleteAnalysis;
//# sourceMappingURL=usersAuth.js.map