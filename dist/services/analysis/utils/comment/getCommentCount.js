"use strict";
exports.__esModule = true;
exports.getCommentCount = void 0;
var getCommentCount = function (_a) {
    var comments = _a.comments, _b = _a.includeReplies, includeReplies = _b === void 0 ? false : _b;
    if (includeReplies) {
        var count = 0;
        for (var _i = 0, comments_1 = comments; _i < comments_1.length; _i++) {
            var comment = comments_1[_i];
            ++count;
            count = count + comment.replyCount;
        }
        return { commentCount: count };
    }
    return { commentCount: comments.length };
};
exports.getCommentCount = getCommentCount;
//# sourceMappingURL=getCommentCount.js.map