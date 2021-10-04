"use strict";
exports.__esModule = true;
exports.getWordsFromComments = void 0;
var filters_1 = require("../filters");
var getWordsFromComments = function (comments) {
    var words = [];
    for (var _i = 0, comments_1 = comments; _i < comments_1.length; _i++) {
        var comment = comments_1[_i];
        if (comment) {
            for (var _a = 0, _b = comment === null || comment === void 0 ? void 0 : comment.split(' '); _a < _b.length; _a++) {
                var word = _b[_a];
                if (word.length > 2) {
                    var result = {
                        word: word.toLowerCase(),
                        brothers: []
                    };
                    for (var _c = 0, _d = comment === null || comment === void 0 ? void 0 : comment.split(' '); _c < _d.length; _c++) {
                        var secondaryWord = _d[_c];
                        if (secondaryWord.length > 2 && secondaryWord !== word) {
                            result.brothers.push(secondaryWord.toLowerCase());
                        }
                    }
                    words.push(result);
                }
            }
        }
    }
    words = filters_1.filterWords(words);
    return { words: words };
};
exports.getWordsFromComments = getWordsFromComments;
//# sourceMappingURL=getWordsFromComments.js.map