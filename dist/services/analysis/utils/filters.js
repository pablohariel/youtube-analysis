"use strict";
exports.__esModule = true;
exports.filterWords = void 0;
var wordList_1 = require("./word/wordList");
var filterWords = function (words) {
    var filteredWords = [];
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var _a = words_1[_i], word = _a.word, brothers = _a.brothers;
        word = filterNonStopWords([word])[0];
        if (word && word.length > 2) {
            var filteredBrothers = [];
            if (brothers.length > 1) {
                filteredBrothers = filterNonStopWords(brothers);
            }
            filteredWords.push({
                word: word,
                brothers: filteredBrothers
            });
        }
    }
    return filteredWords;
};
exports.filterWords = filterWords;
var filterNonStopWords = function (words) {
    var common = wordList_1.stopWords;
    var sentence = words.join(' ');
    var wordArr = sentence.match(/[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ-]+/g);
    var commonObj = {};
    var uncommonArr = [];
    var word;
    var i;
    for (i = 0; i < common.length; i++) {
        commonObj[common[i].trim()] = true;
    }
    if (wordArr) {
        for (i = 0; i < wordArr.length; i++) {
            word = wordArr[i].trim().toLowerCase();
            if (!commonObj[word]) {
                if (word.length > 2) {
                    uncommonArr.push(word);
                }
            }
        }
    }
    return uncommonArr;
};
//# sourceMappingURL=filters.js.map