"use strict";
exports.__esModule = true;
exports.getWordPolarity = void 0;
var wordList_1 = require("./wordList");
var getWordPolarity = function (word, language) {
    if (language === 'pt-br') {
        var _a = wordList_1.polarity.ptBr, positive = _a.positive, negative = _a.negative;
        if (positive.includes(word)) {
            return { result: 'positive' };
        }
        if (negative.includes(word)) {
            return { result: 'negative' };
        }
    }
    return { result: 'neutral' };
};
exports.getWordPolarity = getWordPolarity;
//# sourceMappingURL=getWordPolarity.js.map