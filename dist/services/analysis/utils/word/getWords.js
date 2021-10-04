"use strict";
exports.__esModule = true;
exports.getWords = void 0;
var wordList_1 = require("./wordList");
var getWordsFromComment_1 = require("./utils/getWordsFromComment");
var getWords = function (_a) {
    var comments = _a.comments, _b = _a.includeReplies, includeReplies = _b === void 0 ? false : _b;
    var words = [];
    for (var _i = 0, comments_1 = comments; _i < comments_1.length; _i++) {
        var comment = comments_1[_i];
        var commentWords = getWordsFromComment_1.getCommentWords({ comment: comment.content }).words;
        for (var _c = 0, commentWords_1 = commentWords; _c < commentWords_1.length; _c++) {
            var word = commentWords_1[_c];
            if (!wordList_1.stopWords.includes(word)) {
                words.push({
                    content: word.toLocaleLowerCase(),
                    comment: comment,
                    "class": '',
                    languages: [],
                    polarity: ''
                });
            }
        }
        if (includeReplies) {
            for (var _d = 0, _e = comment.replies; _d < _e.length; _d++) {
                var reply = _e[_d];
                var replyWords = getWordsFromComment_1.getCommentWords({ comment: reply.content }).words;
                for (var _f = 0, replyWords_1 = replyWords; _f < replyWords_1.length; _f++) {
                    var word = replyWords_1[_f];
                    if (!wordList_1.stopWords.includes(word)) {
                        var content = reply.content, author = reply.author, likeCount = reply.likeCount, published_at = reply.published_at;
                        var id = author.id, name = author.name, profileImage = author.profileImage;
                        words.push({
                            content: word,
                            comment: {
                                content: content,
                                author: {
                                    id: id,
                                    name: name,
                                    profileImage: profileImage
                                },
                                likeCount: likeCount,
                                published_at: published_at
                            },
                            "class": '',
                            languages: [],
                            polarity: ''
                        });
                    }
                }
            }
        }
    }
    return { words: words };
};
exports.getWords = getWords;
//# sourceMappingURL=getWords.js.map