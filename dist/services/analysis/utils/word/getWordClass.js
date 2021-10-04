"use strict";
exports.__esModule = true;
exports.getWordClass = void 0;
var wordList_1 = require("./wordList");
var getWordClass = function (word, language) {
    if (language === 'pt-br') {
        var _a = wordList_1.classes.ptBr, adjectives = _a.adjectives, nouns = _a.nouns, verbs = _a.verbs;
        if (adjectives.includes(word)) {
            return { result: 'adjective' };
        }
        if (nouns.includes(word)) {
            return { result: 'noun' };
        }
        if (verbs.includes(word)) {
            return { result: 'verb' };
        }
    }
    return { result: 'undefined' };
};
exports.getWordClass = getWordClass;
//# sourceMappingURL=getWordClass.js.map