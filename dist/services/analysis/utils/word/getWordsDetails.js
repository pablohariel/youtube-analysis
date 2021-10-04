"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.getWordsDetails = void 0;
var getWordPolarity_1 = require("./getWordPolarity");
var getWordClass_1 = require("./getWordClass");
var getWordsDetails = function (words, language) {
    var wordsDetails = [];
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var item = words_1[_i];
        var word = item.word, brothers = item.brothers;
        var wordFound = false;
        for (var _a = 0, wordsDetails_1 = wordsDetails; _a < wordsDetails_1.length; _a++) {
            var wordDetails = wordsDetails_1[_a];
            if (word === wordDetails.word) {
                wordFound = true;
                wordDetails.timesUsed++;
                wordDetails.brothers = __spreadArray(__spreadArray([], wordDetails.brothers), brothers);
            }
        }
        if (!wordFound) {
            if (word.length > 2) {
                var polarityResult = getWordPolarity_1.getWordPolarity(word, language).result;
                var classResult = getWordClass_1.getWordClass(word, language).result;
                wordsDetails.push({
                    word: word,
                    timesUsed: 1,
                    polarity: polarityResult,
                    "class": classResult,
                    brothers: brothers
                });
            }
        }
    }
    var wordDetailsFiltered = [];
    for (var _b = 0, wordsDetails_2 = wordsDetails; _b < wordsDetails_2.length; _b++) {
        var item = wordsDetails_2[_b];
        var brothers = item.brothers;
        var filteredBrothers = [];
        var wordFound = false;
        for (var _c = 0, brothers_1 = brothers; _c < brothers_1.length; _c++) {
            var word = brothers_1[_c];
            for (var _d = 0, filteredBrothers_1 = filteredBrothers; _d < filteredBrothers_1.length; _d++) {
                var brother = filteredBrothers_1[_d];
                if (brother.word === word) {
                    wordFound = true;
                    brother.timesUsed++;
                }
            }
            if (!wordFound) {
                var polarityResult = getWordPolarity_1.getWordPolarity(word, language).result;
                var classResult = getWordClass_1.getWordClass(word, language).result;
                filteredBrothers.push({ word: word, timesUsed: 1, polarity: polarityResult, "class": classResult });
            }
        }
        filteredBrothers = filteredBrothers.sort(function (a, b) {
            if (a.timesUsed > b.timesUsed) {
                return -1;
            }
            if (b.timesUsed < a.timesUsed) {
                return 1;
            }
            return 0;
        });
        wordDetailsFiltered.push({ word: item.word, timesUsed: item.timesUsed, polarity: item.polarity, "class": item["class"], brothers: filteredBrothers });
    }
    wordDetailsFiltered = wordDetailsFiltered.sort(function (a, b) {
        if (a.timesUsed > b.timesUsed) {
            return -1;
        }
        if (b.timesUsed > a.timesUsed) {
            return 1;
        }
        return 0;
    });
    return wordDetailsFiltered;
};
exports.getWordsDetails = getWordsDetails;
//# sourceMappingURL=getWordsDetails.js.map