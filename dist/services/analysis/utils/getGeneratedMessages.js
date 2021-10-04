"use strict";
exports.__esModule = true;
exports.getGeneratedMessages = void 0;
var getMainPolarity_1 = require("./getMainPolarity");
var capitalizeFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
var getGeneratedMessages = function (_a) {
    var words = _a.words, mood = _a.mood;
    var messages = [];
    var firstNoun = words.filter(function (word) {
        if (word["class"] === 'noun') {
            return true;
        }
        return false;
    })[0];
    var mainPolarity = getMainPolarity_1.getMainPolarity({ words: words }).polarity;
    messages.push("People are commenting a lot about " + capitalizeFirstLetter(firstNoun.word));
    messages.push("The general mood is " + mood);
    messages.push("The words majority are of " + mainPolarity + " polarity");
    return messages;
};
exports.getGeneratedMessages = getGeneratedMessages;
//# sourceMappingURL=getGeneratedMessages.js.map