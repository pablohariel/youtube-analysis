"use strict";
exports.__esModule = true;
exports.AppError = void 0;
var AppError = /** @class */ (function () {
    function AppError(message, statusCode) {
        if (statusCode === void 0) { statusCode = 400; }
        this.message = message;
        this.statusCode = statusCode;
    }
    return AppError;
}());
exports.AppError = AppError;
//# sourceMappingURL=AppError.js.map