"use strict";
exports.__esModule = true;
exports.getUsers = void 0;
var getUsers = function (_a) {
    var comments = _a.comments;
    var users = [];
    for (var _i = 0, comments_1 = comments; _i < comments_1.length; _i++) {
        var comment = comments_1[_i];
        var author = comment.author;
        var userFound = false;
        for (var _b = 0, users_1 = users; _b < users_1.length; _b++) {
            var user = users_1[_b];
            if (user.id === author.id) {
                userFound = true;
                user.commentCount++;
                user.comments.push(comment);
            }
        }
        if (!userFound) {
            users.push({
                id: author.id,
                name: author.name,
                profileImage: author.profileImage,
                commentCount: 1,
                comments: [comment]
            });
        }
    }
    return { users: users };
};
exports.getUsers = getUsers;
//# sourceMappingURL=getUsers.js.map