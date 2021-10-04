"use strict";
exports.__esModule = true;
exports.getJoinedWords = void 0;
var getWordsFromComment_1 = require("./utils/getWordsFromComment");
var getJoinedWords = function (_a) {
    var words = _a.words;
    var joinedWords = [];
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var word = words_1[_i];
        var commentWords = getWordsFromComment_1.getCommentWords({ comment: word.comment.content }).words;
        var wordFound = false;
        for (var _b = 0, joinedWords_1 = joinedWords; _b < joinedWords_1.length; _b++) {
            var joinedWord = joinedWords_1[_b];
            if (joinedWord.content === word.content) {
                wordFound = true;
                joinedWord.timesUsed++;
                var joinedWordCommentFound = false;
                for (var _c = 0, _d = joinedWord.comments; _c < _d.length; _c++) {
                    var joinedWordComment = _d[_c];
                    if (joinedWordComment === word.comment) {
                        joinedWordCommentFound = true;
                    }
                }
                if (!joinedWordCommentFound) {
                    joinedWord.comments.push(word.comment);
                }
                for (var _e = 0, commentWords_1 = commentWords; _e < commentWords_1.length; _e++) {
                    var commentWord = commentWords_1[_e];
                    var brotherFound = false;
                    if (commentWord !== joinedWord.content) {
                        for (var _f = 0, _g = joinedWord.brothers; _f < _g.length; _f++) {
                            var brother = _g[_f];
                            if (brother.content === commentWord) {
                                brotherFound = true;
                                ++brother.timesUsed;
                            }
                        }
                        if (!brotherFound) {
                            joinedWord.brothers.push({
                                content: commentWord,
                                timesUsed: 1,
                                "class": '',
                                languages: [],
                                polarity: ''
                            });
                        }
                    }
                }
            }
        }
        if (!wordFound) {
            var newJoinedWord = {};
            newJoinedWord.content = word.content;
            newJoinedWord["class"] = word["class"];
            newJoinedWord.polarity = word.polarity;
            newJoinedWord.languages = word.languages;
            newJoinedWord.timesUsed = 1;
            newJoinedWord.comments = [word.comment];
            newJoinedWord.brothers = [];
            for (var _h = 0, commentWords_2 = commentWords; _h < commentWords_2.length; _h++) {
                var commentWord = commentWords_2[_h];
                var brotherFound = false;
                if (commentWord !== newJoinedWord.content) {
                    for (var _j = 0, _k = newJoinedWord.brothers; _j < _k.length; _j++) {
                        var brother = _k[_j];
                        if (brother.content === commentWord) {
                            brotherFound = true;
                            ++brother.timesUsed;
                        }
                    }
                    if (!brotherFound) {
                        newJoinedWord.brothers.push({
                            content: commentWord,
                            timesUsed: 1,
                            "class": '',
                            languages: [],
                            polarity: ''
                        });
                    }
                }
            }
            joinedWords.push(newJoinedWord);
        }
    }
    return { joinedWords: joinedWords };
};
exports.getJoinedWords = getJoinedWords;
//# sourceMappingURL=getJoinedWords.js.map