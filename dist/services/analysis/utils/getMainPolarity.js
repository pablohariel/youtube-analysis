"use strict";
exports.__esModule = true;
exports.getMainPolarity = void 0;
var getMainPolarity = function (_a) {
    var words = _a.words;
    var positive = 0;
    var negative = 0;
    var neutral = 0;
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var item = words_1[_i];
        switch (item.polarity) {
            case 'positive':
                positive++;
                break;
            case 'negative':
                negative++;
                break;
            case 'neutral':
                neutral++;
                break;
            default:
                break;
        }
    }
    if (positive >= negative && positive >= neutral) {
        return { polarity: 'positive' };
    }
    if (negative >= positive && negative >= neutral) {
        return { polarity: 'negative' };
    }
    return { polarity: 'neutral' };
};
exports.getMainPolarity = getMainPolarity;
//# sourceMappingURL=getMainPolarity.js.map