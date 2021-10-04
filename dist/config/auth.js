"use strict";
exports.__esModule = true;
require('dotenv').config();
exports["default"] = {
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d'
    }
};
//# sourceMappingURL=auth.js.map