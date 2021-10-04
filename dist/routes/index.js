"use strict";
exports.__esModule = true;
exports.routes = void 0;
var express_1 = require("express");
var users_routes_1 = require("./users.routes");
var sessions_routes_1 = require("./sessions.routes");
var analysis_routes_1 = require("./analysis.routes");
var routes = express_1.Router();
exports.routes = routes;
routes.use('/users', users_routes_1.usersRouter);
routes.use('/sessions', sessions_routes_1.sessionsRouter);
routes.use('/analysis', analysis_routes_1.analysisRouter);
//# sourceMappingURL=index.js.map