"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DictUtils = /** @class */ (function () {
    function DictUtils() {
    }
    DictUtils.getDictList = function (dictData, dictName) {
        // console.log(dictData)
        // @ts-ignore
        return dictData[dictName] || [];
    };
    DictUtils.getDictLabel = function (dictData, dictName, value) {
        var label = '';
        var map = this.getDictList(dictData, dictName);
        map.forEach(function (arr) {
            if (arr.value === value) {
                label = arr.label;
            }
        });
        return label;
    };
    return DictUtils;
}());
exports.default = DictUtils;
