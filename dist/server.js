"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
require("express-async-errors");
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var routes_1 = require("./routes");
var AppError_1 = require("./errors/AppError");
var swagger_json_1 = __importDefault(require("./utils/swagger.json"));
var app = express_1["default"]();
app.use(cors_1["default"]());
app.use(express_1["default"].json());
app.use('/api-docs', swagger_ui_express_1["default"].serve, swagger_ui_express_1["default"].setup(swagger_json_1["default"]));
app.use(routes_1.routes);
app.use(function (err, request, response, _) {
    if (err instanceof AppError_1.AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }
    console.log(err);
    return response.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
});
app.listen(3333, function () {
    // process.stdout.write('\x1Bc')
    console.log('Server up at port 3333');
});
//# sourceMappingURL=server.js.map