"use strict";
exports.__esModule = true;
exports.getUsersMood = void 0;
var wordList_1 = require("./word/wordList");
var getUsersMood = function (words) {
    var goodComments = 0;
    var badComments = 0;
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var item = words_1[_i];
        if (wordList_1.polarity.ptBr.positive.includes(item.word)) {
            goodComments++;
        }
        if (wordList_1.polarity.ptBr.negative.includes(item.word)) {
            badComments++;
        }
    }
    console.log(goodComments, badComments);
    var total = goodComments + badComments;
    var percentGood = (goodComments / total) * 100;
    if (percentGood >= 80)
        return { mood: 'very good' };
    if (percentGood >= 60 && percentGood < 80)
        return { mood: 'good' };
    if (percentGood >= 40 && percentGood < 60)
        return { mood: 'neutral' };
    if (percentGood >= 20 && percentGood < 40)
        return { mood: 'bad' };
    if (percentGood > 0 && percentGood < 20)
        return { mood: 'very bad' };
    return { mood: 'no mood' };
};
exports.getUsersMood = getUsersMood;
//# sourceMappingURL=getUsersMood.js.map