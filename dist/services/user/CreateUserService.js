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
exports.CreateUserService = void 0;
var bcryptjs_1 = require("bcryptjs");
var connection_1 = require("../../database/connection");
var AppError_1 = require("../../errors/AppError");
var CreateUserService = /** @class */ (function () {
    function CreateUserService() {
    }
    CreateUserService.prototype.execute = function (_a) {
        var _b = _a.email, email = _b === void 0 ? '' : _b, _c = _a.password, password = _c === void 0 ? '' : _c, _d = _a.name, name = _d === void 0 ? '' : _d;
        return __awaiter(this, void 0, void 0, function () {
            var checkUserExists, hashedPassword, user;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (email.length < 1 || password.length < 1) {
                            throw new AppError_1.AppError('Required field not informed');
                        }
                        if (email.length < 3) {
                            throw new AppError_1.AppError('Invalid email', 422);
                        }
                        if (name) {
                            if (name.length < 3) {
                                throw new AppError_1.AppError('Name too short', 422);
                            }
                        }
                        if (password.length < 8) {
                            throw new AppError_1.AppError('Password too short', 422);
                        }
                        return [4 /*yield*/, connection_1.prisma.user.findUnique({
                                where: {
                                    email: email
                                }
                            })];
                    case 1:
                        checkUserExists = _e.sent();
                        if (checkUserExists) {
                            throw new AppError_1.AppError('Email address already used', 409);
                        }
                        return [4 /*yield*/, bcryptjs_1.hash(password, 8)];
                    case 2:
                        hashedPassword = _e.sent();
                        return [4 /*yield*/, connection_1.prisma.user.create({
                                data: {
                                    email: email,
                                    name: name,
                                    password: hashedPassword
                                },
                                select: {
                                    id: true,
                                    isAdmin: true,
                                    email: true,
                                    name: true,
                                    created_at: true,
                                    updated_at: true
                                }
                            })];
                    case 3:
                        user = _e.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    return CreateUserService;
}());
exports.CreateUserService = CreateUserService;
//# sourceMappingURL=CreateUserService.js.map