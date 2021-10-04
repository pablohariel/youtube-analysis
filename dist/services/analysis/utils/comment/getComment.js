"use strict";
exports.__esModule = true;
exports.getComment = void 0;
var getComment = function (_a) {
    var comments = _a.comments, _b = _a.filter, filter = _b === void 0 ? 'mostLikes' : _b;
    switch (filter) {
        case 'mostLikes': {
            var comment = comments.sort(function (commentL, commentR) {
                if (commentL.likeCount > commentR.likeCount) {
                    return -1;
                }
                if (commentL.likeCount < commentR.likeCount) {
                    return 1;
                }
                return 0;
            })[0];
            return { comment: comment };
        }
        case 'oldest': {
            var comment = comments.sort(function (commentL, commentR) {
                var dateL = new Date(commentL.published_at);
                var dateR = new Date(commentR.published_at);
                if (dateL > dateR) {
                    return 1;
                }
                if (dateL < dateR) {
                    return -1;
                }
                return 0;
            })[0];
            return { comment: comment };
        }
        case 'newest': {
            var comment = comments.sort(function (commentL, commentR) {
                var dateL = new Date(commentL.published_at);
                var dateR = new Date(commentR.published_at);
                if (dateL > dateR) {
                    return -1;
                }
                if (dateL < dateR) {
                    return 1;
                }
                return 0;
            })[0];
            return { comment: comment };
        }
        case 'mostReplies': {
            var comment = comments.sort(function (commentL, commentR) {
                if (commentL.replyCount > commentR.replyCount) {
                    return -1;
                }
                if (commentL.replyCount < commentR.replyCount) {
                    return 1;
                }
                return 0;
            })[0];
            return { comment: comment };
        }
        default:
            return { comment: undefined };
    }
};
exports.getComment = getComment;
//# sourceMappingURL=getComment.js.map