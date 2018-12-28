(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('qs')) :
  typeof define === 'function' && define.amd ? define(['exports', 'qs'], factory) :
  (factory((global.CRUD = {}),global.qs));
}(this, (function (exports,qs) { 'use strict';

  function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

  function _typeof(obj) {
    if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
      _typeof = function _typeof(obj) {
        return _typeof2(obj);
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
      };
    }

    return _typeof(obj);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  function stringifyURL(str, options) {
    if (!str) {
      return str;
    }

    return str.replace(/:(\w+)/gi, function (match, p1) {
      var replacement = options[p1];

      if (!replacement) {
        throw new Error('Could not find url parameter ' + p1 + ' in passed options object');
      }

      return replacement;
    });
  }

  function processParams(object) {
    var column = object.column,
        current = object.current,
        showQuickJumper = object.showQuickJumper,
        pageSize = object.pageSize,
        total = object.total,
        field = object.field,
        order = object.order,
        pageSizeOptions = object.pageSizeOptions,
        showSizeChanger = object.showSizeChanger,
        columnKey = object.columnKey,
        other = _objectWithoutProperties(object, ["column", "current", "showQuickJumper", "pageSize", "total", "field", "order", "pageSizeOptions", "showSizeChanger", "columnKey"]);

    var body = _objectSpread({
      currentPage: current,
      totalCount: total,
      pageSize: pageSize
    }, other);

    return body;
  }

  var defaults = {
    credentials: 'include' // mode: 'cors',
    // headers: {
    //   "Content-Type": "application/json",
    //   "X-Requested-With": "XMLHttpRequest",
    //   'Access-Control-Allow-Origin': '*',
    // }

  };
  function toData(json) {
    if (json.code === 0) {
      return json.data;
    } else {
      return json;
    }
  }
  function fetchCatch(error) {
    return error;
  }
  function fetchRequest(url, options) {
    return fetch(url, Object.assign({}, defaults, options)).then(function (res) {
      if (res.ok === true) {
        return res;
      } else {
        var err = new Error(res.statusText);
        err.response = res;
        throw err;
      }
    }).then(function (res) {
      return res.json();
    });
  }
  function processBody(options, format) {
    if (options && _typeof(options.body) === 'object') {
      options.body = processParams(options.body);
    }

    return options;
  }
  function fetchList(url, options) {
    return fetchGet(url, options);
  }
  function fetchGet(url, options) {
    options = processBody(options);

    if (options && options.body && options.body !== "") {
      url = [stringifyURL(url, options.body), qs.stringify(options.body)].join("?");
    }

    options && delete options.body;
    return fetchRequest(url, Object.assign({
      method: 'GET'
    }, options));
  }
  function fetchPost(url, options) {
    options = processBody(options);

    if (options && options.body && options.body !== "") {
      options.body = JSON.stringify(options.body);
    }

    return fetchRequest(stringifyURL(url, options.body), Object.assign({
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      method: 'POST'
    }, options));
  }
  function fetchPut(url, options) {
    return fetchPost(url, Object.assign(options, {
      method: 'PUT'
    }));
  }
  function fetchUpload(url, options) {
    return fetchPost(url, Object.assign(options, {// headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'}
    }));
  }
  function fetchDownload(url, options) {
    return fetchGet(url, Object.assign(options, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'multipart/form-data;charset=UTF-8'
      }
    })).then(function (res) {
      var blob = new Blob([res.data]);
      var a = document.createElement('a');
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = decodeURI(filename);
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  var index = /*#__PURE__*/Object.freeze({
    toData: toData,
    fetchCatch: fetchCatch,
    fetchRequest: fetchRequest,
    processBody: processBody,
    fetchList: fetchList,
    fetchGet: fetchGet,
    fetchPost: fetchPost,
    fetchPut: fetchPut,
    fetchUpload: fetchUpload,
    fetchDownload: fetchDownload
  });

  function getBIZLabel(codeData, value) {
    var label = '未知';

    try {
      codeData.forEach(function (arr) {
        if (arr.code === value) {
          label = arr.message; //throw 'Finish and value = ' + label
        }
      });
    } catch (e) {
      console.log(e);
    }

    return label;
  }

  var index$1 = /*#__PURE__*/Object.freeze({
    getBIZLabel: getBIZLabel
  });

  function getDictList(dictData, dicName) {
    // console.log(dictData)
    return dictData[dicName] || [];
  }
  function getDictLabel(dictData, dicName, value) {
    var label = '';

    try {
      var map = getDictList(dictData, dicName);
      map.forEach(function (arr) {
        if (arr.value === value) {
          label = arr.label; // throw 'Finish and value = ' + label 
        }
      });
    } catch (e) {
      console.log(e);
    } // console.log(label)


    return label;
  }

  var index$2 = /*#__PURE__*/Object.freeze({
    getDictList: getDictList,
    getDictLabel: getDictLabel
  });

  /**
   * json转换，国际化标准格式
   * @param {} data 
   */
  function transferJson(data) {
    var temp = [];

    try {
      if (!!data) {
        temp = getTransferJson(data, temp, '', '.');
      } else {
        throw "待转译的json对象异常";
      }
    } catch (error) {
      console.log(error);
    }

    return temp;
  }

  function getTransferJson(jsons, temp, name, sign) {
    for (var key in jsons) {
      var k = "";

      if (name === "" || name === undefined) {
        k = key;
      } else {
        k = name + sign + key;
      }

      if (!(jsons[key] instanceof Object)) {
        var arrObj = {};
        var kKey = k;
        arrObj[kKey] = jsons[key];
        temp.push(arrObj);
      } else {
        getTransferJson(jsons[key], temp, k, sign);
      }
    }

    return temp || [];
  }
  /**
   * json转换带ID
   * @param {} data 
   */


  function transferJsonContainsID(data) {
    var temp = {};

    try {
      if (!!data) {
        temp = getTransferJsonContainsID(data, temp, '', '.');
      } else {
        throw "待转译的json对象异常";
      }
    } catch (error) {
      console.log(error);
    }

    return temp;
  }

  function getTransferJsonContainsID(jsons, temp, name, sign) {
    for (var key in jsons) {
      var k = "";

      if (name === "" || name === undefined) {
        k = key;
      } else {
        k = name + sign + key;
      }

      if (_typeof(jsons[key]) === "object" && jsons[key].constructor === Object) {
        if (jsons[key].hasOwnProperty("defaultMessage")) {
          temp[k] = {
            "id": k,
            "defaultMessage": jsons[key].defaultMessage
          };
        } else {
          getTransferJsonContainsID(jsons[key], temp, k, sign);
        }
      }
    }

    return temp || {};
  }

  var index$3 = /*#__PURE__*/Object.freeze({
    transferJson: transferJson,
    transferJsonContainsID: transferJsonContainsID
  });

  exports.FetchUtils = index;
  exports.BIZCodeUtils = index$1;
  exports.DictUtils = index$2;
  exports.TransferUtils = index$3;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
