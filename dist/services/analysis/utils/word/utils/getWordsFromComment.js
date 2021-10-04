"use strict";
exports.__esModule = true;
exports.getCommentWords = void 0;
var getCommentWords = function (_a) {
    var _b;
    var comment = _a.comment;
    var words = (_b = comment.match(/[A-Za-záàâãéèêíïóôõöúçqQñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ-]+/g)) === null || _b === void 0 ? void 0 : _b.map(function (word) { return word.toLocaleLowerCase(); });
    if (words) {
        return { words: words };
    }
    return { words: [] };
};
exports.getCommentWords = getCommentWords;
//# sourceMappingURL=getWordsFromComment.js.map