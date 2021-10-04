"use strict";
exports.__esModule = true;
exports.getUserWithMostComment = void 0;
var getUserWithMostComment = function (_a) {
    var users = _a.users;
    var topUsers = users.sort(function (userL, userR) {
        if (userL.commentCount > userR.commentCount) {
            return -1;
        }
        if (userL.commentCount < userR.commentCount) {
            return 1;
        }
        return 0;
    });
    var topUser = topUsers[0];
    return { user: topUser };
};
exports.getUserWithMostComment = getUserWithMostComment;
//# sourceMappingURL=getUserWithMostComment.js.map