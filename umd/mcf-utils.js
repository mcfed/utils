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

  /**
   * 处理url，将url中带有:key的字符串替换成options中属性key的真值
   *
   * @example http://.../user/:id -> http://.../user/1 (如果options对象中存在属性id=1，不存在则报错)
   *
   * @param {string} str URL字符串
   * @param {object} options 替换URL中:key的值的对象
   * @return {string} Desc: 返回处理过的字符串
   * @throws 如果匹配到:key,但是options中options[key]为假值，则抛出 "Could not find url parameter key in passed options object"的错误
   */

  function stringifyURL(str, options) {
    if (!str) {
      return str;
    }

    return str.replace(/:([A-Z|a-z]+)/gi, function (match, p1) {
      var replacement = options[p1];

      if (!replacement) {
        throw new Error("Could not find url parameter " + p1 + " in passed options object");
      }

      return replacement;
    });
  }
  /**
   * 处理对象返回Graphql中请求变量的字符串
   *
   * @example {
   *  key1: 'value1',
   *  key2: 'value2'
   * } -> "{\"key1\":\"value1\",\"key2\":\"value2\",\"start\":0,\"end\":9}"
   *
   * @param {object} params 需要处理的对象
   * @return {string} Desc: 处理完成的字符串
   */

  function processGraphqlParams() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var column = params.column,
        current = params.current,
        showQuickJumper = params.showQuickJumper,
        pageSize = params.pageSize,
        total = params.total,
        field = params.field,
        pageSizeOptions = params.pageSizeOptions,
        showSizeChanger = params.showSizeChanger,
        columnKey = params.columnKey,
        order = params.order,
        otherParam = _objectWithoutProperties(params, ["column", "current", "showQuickJumper", "pageSize", "total", "field", "pageSizeOptions", "showSizeChanger", "columnKey", "order"]);

    return Object.assign({}, otherParam, {
      start: (current - 1) * pageSize || 0,
      end: current * pageSize - 1 || 9
    }, order ? {
      order: order && order.replace(/end$/, "")
    } : {}, columnKey ? {
      orderBy: columnKey
    } : {});
  }
  /**
   * 将参数对象中每一个数组json.stringify,空数组和空字符串变成undefined
   *
   * @example {
   *    key1: 'value1',
   *    key2: [],
   *    key3: [1,2,3]
   * } -> {
   *    key1: 'value1',
   *    key2: undefined,
   *    key3: '[1,2,3]'
   * }
   *
   * @param {object} object
   * @return {object} Desc: 返回处理后的对象
   */

  function processPraramItem(object) {
    for (var key in object) {
      if (object[key] instanceof Array) {
        if (object[key].length !== 0) {
          object[key] = JSON.stringify(object[key]);
        } else {
          object[key] = undefined;
        }
      } else {
        if (object[key] === "") {
          object[key] = undefined;
        }
      }
    }

    return object;
  }
  /**
   * 处理参数
   *
   * @example {
   *    column: {},
   *    current: 1,
   *    showQuickJumper: true,
   *    pageSize: 20,
   *    total: 1123,
   *    field: 'field',
   *    pageSizeOptions: {},
   *    showSizeChanger: false,
   *    key1: 'value1',
   *    key2: [],
   *    key3: [ 1, 2, 3 ]
   *  } -> {
   *    column: {},
   *    current: 1,
   *    showQuickJumper: true,
   *    pageSize: 20,
   *    total: 1123,
   *    field: 'field',
   *    pageSizeOptions: {},
   *    showSizeChanger: false,
   *    key1: 'value1',
   *    key2: [],
   *    key3: [ 1, 2, 3 ]
   *  }
   *
   * @private
   * @param {object} object
   * @return {object} Desc: 返回处理后的对象
   */

  function processParams(object) {
    var column = object.column,
        current = object.current,
        showQuickJumper = object.showQuickJumper,
        pageSize = object.pageSize,
        total = object.total,
        field = object.field,
        pageSizeOptions = object.pageSizeOptions,
        showSizeChanger = object.showSizeChanger,
        other = _objectWithoutProperties(object, ["column", "current", "showQuickJumper", "pageSize", "total", "field", "pageSizeOptions", "showSizeChanger"]);

    var body = _objectSpread({
      currentPage: current,
      totalCount: total,
      pageSize: pageSize
    }, other);

    return processPraramItem(body);
  }
  /**
   * HTTP HEADER 的默认值
   *
   * @constant
   * @default
   * @example {
   *    credentials: "include",
   *    mode: "cors",
   *    headers: {
   *      "Content-Type": "application/json; charset=UTF-8",
   *      "X-Requested-With": "XMLHttpRequest",
   *      "Access-Control-Allow-Origin": "*",
   *      "Pragma": "no-cache"
   *    }
   * }
   */


  var defaults = {
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      "Access-Control-Allow-Origin": "*",
      Pragma: "no-cache"
    }
  };
  var defaultsHeaders = defaults;
  /**
   * 返回传入的错误
   *
   * @param {object} error
   * @return {object} Desc: error
   */

  function fetchCatch(error) {
    return error;
  }
  /**
   * 获取请求处理结果
   *    返回数据中ok=true，则返回全部数据，如果返回的状态status是401或601且全局的dispatchEvent存在还发送登出事件，返回结果结构为 { code, message }
   *
   * @param {string} url 请求链接
   * @param {object} options 请求选项参数
   * @return {object} Desc: 请求结果
   * @throws  如果全局的fetch 不存在则抛出措施 import fetch from 'cross-fetch'  // import you fetch utils global.fetch = fetch
   */

  function fetchRequest(url, options) {
    if (global.fetch) {
      if (global.fetch.responseProcess) {
        return fetch(url, Object.assign({}, defaults, options)).then(global.fetch.responseProcess);
      } else {
        return fetch(url, Object.assign({}, defaults, options)).then(function (res) {
          if (res.ok === true) {
            return res;
          } else if (res.status == 601 || res.status == 401) {
            global.dispatchEvent && global.dispatchEvent(new CustomEvent("login_out"));
            return {
              code: res.status,
              message: res.statusText
            };
          } else {
            // var err = new Error(res.statusText)
            // err.response = res
            // throw err
            return {
              code: res.status,
              message: res.statusText
            };
          }
        }).then(function (res) {
          if (options.responseType === "arraybuffer") {
            return res;
          } else if (res.code) {
            return res;
          } else {
            return res.json();
          }
        }).catch(function (e) {
          console.log(e);
        });
      }
    } else {
      console.error("\n      import fetch from 'cross-fetch'  // import you fetch utils\n      global.fetch = fetch\n    ");
    }
  }
  /**
   * 处理请求体
   *
   * @param {object} options
   * @param {object} options.body
   * @return {object} Desc: 返回处理过body的options
   */

  function processBody(options, format) {
    if (options && _typeof(options.body) === "object") {
      options.body = processParams(options.body);
    }

    return options;
  }
  /**
   * 获取列表数据（GET）
   *
   * @param {string} url 请求链接
   * @param {object} options 请求选项参数
   */

  function fetchList(url, options) {
    return fetchGet(url, options);
  }
  /**
   * 获取数据（GET）
   *
   * @param {string} url 请求链接
   * @param {object} options 请求选项参数
   */

  function fetchGet(url, options) {
    options = processBody(options);

    if (options && options.body && options.body !== "") {
      url = [stringifyURL(url, options.body), qs.stringify(options.body)].join(url.indexOf("?") > 0 ? "&" : "?");
    }

    options && delete options.body;
    return fetchRequest(url, Object.assign({}, {
      method: "GET"
    }, options));
  }
  /**
   * 更新数据（POST）
   *
   * @param {string} url 请求链接
   * @param {object} options 请求选项参数
   */

  function fetchPost(url, options) {
    url = stringifyURL(url, options.body); // options=processBody(options)

    if (options && options.body && options.body !== "") {
      options.body = JSON.stringify(options.body);
    } // console.log(options)


    return fetchRequest(url, Object.assign({
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Pragma: "no-cache"
      },
      method: "POST"
    }, options));
  }
  /**
   * 更新数据（PUT）
   *
   * @param {string} url 请求链接
   * @param {object} options 请求选项参数
   */

  function fetchPut(url, options) {
    return fetchPost(url, Object.assign({}, options, {
      method: "PUT"
    }));
  }
  /**
   * 删除数据（DELETE）
   *
   * @param {string} url 请求链接
   * @param {object} options 请求选项参数
   */

  function fetchDelete(url, options) {
    return fetchPost(url, Object.assign({}, options, {
      method: "DELETE"
    }));
  }
  /**
   * 获取数据（Graphql接口）
   *
   * @param {string} url 请求链接
   * @param {object} options 请求选项参数
   */

  function fetchGraphql(url, options, querys) {
    return fetchPost(url, Object.assign({}, options, {
      body: options && options.body ? {
        operationName: options.body.operationName,
        query: options.body.query,
        variables: processGraphqlParams(options.body.variables)
      } : {},
      credentials: "include",
      // include, same-origin, *omit
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Pragma: "no-cache"
      },
      method: "POST",
      // *GET, POST, PUT, DELETE, etc.
      mode: "cors" // no-cors, cors, *same-origin

    }));
  }
  /**
   * 获取数据（Graphql接口，返回去掉data.result的外包装）
   *
   * @param {string} url 请求链接
   * @param {object} options 请求选项参数
   */

  function fetchGraphqlAsResult(url, options, querys) {
    return fetchGraphql(url, options, querys).then(function (result) {
      return result.data.result;
    });
  }
  /**
   * 获取数据(Graphql列表接口，返回去掉data.result的外包装)
   *
   * @param {string} url 请求链接
   * @param {object} options 请求选项参数
   */

  function fetchGraphqlList(url, options, querys) {
    return fetchGraphqlAsResult(url, options, querys);
  }
  /**
   * 上传数据
   *
   * @param {string} url 请求链接
   * @param {object} options 请求选项参数
   */

  function fetchUpload(url, options) {
    return fetchPost(url, Object.assign({}, options, {// headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'}
    }));
  }
  /**
   * 下载文件流
   *
   * @param {string} url 请求链接
   * @param {object} options 请求选项参数
   */

  function fetchDownload(url, options) {
    return fetchGet(url, Object.assign({}, options, {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "multipart/form-data;charset=UTF-8",
        Pragma: "no-cache"
      }
    })).then(function (res) {
      return res.blob().then(function (blob) {
        if (blob) {
          var a = document.createElement("a");
          var url = window.URL.createObjectURL(blob);
          var filename = res.headers.get("Content-Disposition") || "";
          document.body.appendChild(a);
          a.href = url;
          a.download = decodeURI(filename.replace("attachment;filename=", ""));
          a.click(); //修正Firefox 无法下载问题

          setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 100);
          return true;
        } else {
          console.error("no data!");
          return false;
        }
      });
    });
  }

  var index = /*#__PURE__*/Object.freeze({
    stringifyURL: stringifyURL,
    processGraphqlParams: processGraphqlParams,
    processPraramItem: processPraramItem,
    defaultsHeaders: defaultsHeaders,
    fetchCatch: fetchCatch,
    fetchRequest: fetchRequest,
    processBody: processBody,
    fetchList: fetchList,
    fetchGet: fetchGet,
    fetchPost: fetchPost,
    fetchPut: fetchPut,
    fetchDelete: fetchDelete,
    fetchGraphql: fetchGraphql,
    fetchGraphqlAsResult: fetchGraphqlAsResult,
    fetchGraphqlList: fetchGraphqlList,
    fetchUpload: fetchUpload,
    fetchDownload: fetchDownload
  });

  /**
   * @module BIZCodeUtils
   */

  /**
   * 获取业务码的标签
   * 
   * @example [
   *  codeData: { code: 1, message: 'success' }
   *  value: 1 -> 'success'
   *  value: 2 -> '未知'
   * ]
   * 
   * @param {object} codeData 业务码数据 
   * @param {string|number} value 业务码
   * @return {string} Desc: 返回标签
   */
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

  /**
   * @module DictUtils
   */

  /**
   * 获取字典列表
   * 
   * @example [
   *   dictData: {'key': [1, 2], 'key2': [3, 4]}
   *   dicName: 'key' -> [1, 2]
   *   dicName: 'key3' -> []
   * ]
   * 
   * @param {object} dictData 字典数据
   * @param {string} dicName 属性名称
   * @return {array} Desc: 返回字典列表
   */
  function getDictList(dictData, dicName) {
    // console.log(dictData)
    return dictData[dicName] || [];
  }
  /**
   * 获取字典的摸狗属性的标签
   * 
   * Note: 要求字典数据的结构严格按照{ [dicName]: [{ label, value }] }
   * 
   * @example [
   *   dictData: {'key': [{ label: 'label1', value: 1, label: 'label2', value: 2 }], 'key2': []}
   *   dicName: 'key'
   *   value: 1 -> 'label1'
   *   value: 3 -> ''
   * ]
   * 
   * @param {object} dictData 字典数据
   * @param {string} dicName 属性名称
   * @param {string} value 值
   * @return {string} Desc: 返回标签
   */

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
   * @module ValidatorUtils
   */

  /**
   * 验证非法字符串
   * 
   * @example 字符串验证的正则表达式为 /^[A-z0-9\\_\\#\\$\\\u4e00-\u9fa5]*$/
   * 
   * @inner
   * @param {string} rule 规则（暂时无用）
   * @param {string} value 需要验证的字符串
   * @param {function} callback 完成回调
   * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回请不要输入非法字符
   */
  function validateSpecialCharacters(rule, value, callback) {
    var message = '请不要输入非法字符';
    var regEx = /^[A-z0-9\\_\\#\\$\\\u4e00-\u9fa5]*$/;

    if (value && !regEx.test(value)) {
      callback(message);
    } else {
      callback();
    }
  }
  /**
   * 验证IP地址
   * 
   * @example 字符串验证的正则表达式为/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
   * 
   * @inner
   * @param {string} rule 规则（暂时无用）
   * @param {string} value 需要验证的字符串
   * @param {function} callback 完成回调
   * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回IP地址不正确
   */


  function checkIP(rule, value, callback) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

    if (value && !reg.test(value)) {
      callback("IP地址不正确");
    } else {
      // console.log("callback")
      callback();
    }
  }
  /**
   * 验证端口
   * 
   * @example 字符串验证的正则表达式为/^(\d)+$/g 且小于等于65535 且大于0
   * 
   * @inner
   * @param {string} rule 规则（暂时无用）
   * @param {string} value 需要验证的字符串
   * @param {function} callback 完成回调
   * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回请输入正确的端口
   */


  function validatePort(rule, value, callback) {
    var message = '请输入正确的端口';
    var parten = /^(\d)+$/g;

    if (!value) {
      callback();
    } else {
      if (parten.test(value) && parseInt(value) <= 65535 && parseInt(value) > 0) {
        callback();
      } else {
        callback(message);
      }
    }
  }
  /**
   * 验证端口或域名
   * 
   * @example 字符串验证的正则表达式为/^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/ 
   * 
   * @inner
   * @param {string} rule 规则（暂时无用）
   * @param {string} value 需要验证的字符串
   * @param {function} callback 完成回调
   * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回端口或域名不正确！
   */


  function checkIPorDomain(rule, value, callback) {
    var reg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/;

    if (value && !reg.test(value)) {
      callback("端口或域名不正确！");
    } else {
      // console.log("callback")
      callback();
    }
  }
  /**
   * 验证IP地址
   * 
   * @example 字符串验证的正则表达式为 /^[0-9a-fA-F\\.\\:////]{2,39}$/
   * 
   * @inner
   * @param {string} rule 规则（暂时无用）
   * @param {string} value 需要验证的字符串
   * @param {function} callback 完成回调
   * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回Ip地址不正确
   */


  function checkIPCust(rule, value, callback) {
    var reg = /^[0-9a-fA-F\\.\\:////]{2,39}$/;

    if (!reg.test(value)) {
      callback("Ip地址不正确");
    } else {
      callback();
    }
  }
  /**
   * 验证非法字符
   * 
   * @example 字符串验证的正则表达式为 /^[A-z0-9\\\s+\\_\\#\\$\\\u4e00-\u9fa5]*$/
   * 
   * @inner
   * @param {string} rule 规则（暂时无用）
   * @param {string} value 需要验证的字符串
   * @param {function} callback 完成回调
   * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回请不要输入非法字符
   */


  function validateToNextPassword(rule, value, callback) {
    var message = '请不要输入非法字符';
    var regEx = /^[A-z0-9\\\s+\\_\\#\\$\\\u4e00-\u9fa5]*$/;

    if (value && !regEx.test(value)) {
      callback(message);
    } else {
      callback();
    }
  }
  /**
   * 验证密码强度
   * 
   * @example 字符串验证的正则表达式为 /^\d{1,6}$/
   * 
   * @inner
   * @param {string} rule 规则（暂时无用）
   * @param {string} value 需要验证的字符串
   * @param {function} callback 完成回调
   * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回密码为弱密码！
   */


  function checkWeekPassword(rule, value, callback) {
    if (/^\d{1,6}$/.test(value)) {
      callback('密码为弱密码！');
    } else {
      callback();
    }
  }
  /**
   * 验证手机号码格式
   * 
   * Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
   * @example 字符串验证的正则表达式为 /^(0?1[123456789]\d{9})$/
   *  
   * @inner
   * @param {string} rule 校验规则（暂时无用）
   * @param {string} value 需要验证的字符串
   * @param {function} callback 完成回调
   * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回手机号码格式不正确！
   */


  function checkMobile(rule, value, callback) {
    var rexp = /^(0?1[123456789]\d{9})$/;

    if (value && !rexp.test(value)) {
      callback('手机号码格式不正确！');
    } else {
      callback();
    } // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应

  }
  /**
   * 验证邮箱格式
   * 
   * @example 字符串验证的正则表达式为 /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
   *  
   * @inner
   * @param {string} rule 校验规则（暂时无用）
   * @param {string} value 需要验证的字符串
   * @param {function} callback 完成回调
   * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回邮箱格式不正确！
   */


  function checkEmail(rule, value, callback) {
    var rexp = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

    if (value && !rexp.test(value)) {
      callback('邮箱格式不正确！');
    } else {
      callback();
    }
  }
  /**
   * 验证身份证号码格式
   * 
   * @example 字符串验证的正则表达式为 /(^\d{17}(\d|x|X)$)/i
   *  
   * @inner
   * @param {string} rule 校验规则（暂时无用）
   * @param {string} value 需要验证的字符串
   * @param {function} callback 完成回调
   * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回身份证号码格式不正确！
   */


  function checkIDCard(rule, value, callback) {
    var rexp = /(^\d{17}(\d|x|X)$)/i;

    if (!rexp.test(value)) {
      callback('身份证号码格式不正确！');
    } else {
      callback();
    }
  }
  /**
   * 验证数字边界
   * 
   * @example [
   *  rangs: [1, 9]
   *  value: 8 -> 通过
   *  value: 11-> 请输入区间值[1, 9]
   * ]
   * 
   * @inner
   * @param {object} rule 校验规则
   * @param {number[]} rule.ranges 边界数组[min, max]
   * @param {number} value 需要验证的值
   * @param {function} callback 完成回调
   * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回请输入区间值[min, max]
   */


  function ranges(rule, value, callback) {
    if (rule.ranges instanceof Array && rule.ranges.length === 2) {
      if (rule.ranges[0] > value || rule.ranges[1] < value) {
        callback("\u8BF7\u8F93\u5165\u533A\u95F4\u503C".concat(JSON.stringify(rule.ranges)));
      } else {
        callback();
      }
    } else {
      callback();
    }
  }
  /**
   * 验证文件尺寸
   * 
   * @example [
   *  rule: { fileSize: 1024 * 1024 }
   *  value: { file: { size: 1024 } } -> 通过
   *  value: { file: { size: 1024 * 1024 * 1024 } }-> 文件大小不超过 1024 * 1024
   * ]
   * @inner
   * @param {object} rule 校验规则
   * @param {number} rule.fileSize 文件尺寸最大值
   * @param {object} value 需要验证的文件对象
   * @param {object} value.file 需要验证的文件对象
   * @param {number} value.file.size 文件尺寸大小
   * @param {function} callback 完成回调
   * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回文件大小不超过fileSize
   */


  function fileSize(rule, value, callback) {
    if (value.file && value.file.size > rule.fileSize) {
      callback("\u6587\u4EF6\u5927\u5C0F\u4E0D\u8D85\u8FC7 ".concat(rule.fileSize));
    } else {
      callback();
    }
  }
  /**
   * 验证字符串/数组元素为正整数
   * 
   * Note: 只验证数组的元素和字符串是否为正整数 其他的数据类型暂不校验
   * 
   * @example 字符串验证的正则表达式为 /^([1-9]\d*|[0]{0,1})$/
   * 
   * @inner
   * @param {string} rule 校验规则（暂时无用）
   * @param {string|number[]} value 需要验证的字符串
   * @param {function} callback 完成回调
   * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回必须为正整数！
   */


  function integer(rule, value, callback) {
    var rexp = /^([1-9]\d*|[0]{0,1})$/;

    if (value instanceof Array) {
      for (var i = 0; i < value.length; i++) {
        if (!rexp.test(value[i])) {
          return callback('必须为正整数！');
        } else {
          return callback();
        }
      }

      return callback();
    } else if (typeof value === "string") {
      if (!rexp.test(value)) {
        return callback('必须为正整数！');
      } else {
        return callback();
      }
    }

    return callback();
  }
  /**
   * 验证长度
   * 
   * Note: 只验证数据类型可以获取.length的有效结果的数据类型，包括字符串和数组
   * 
   * @example [
   *  rule: { value: 5 }
   *  value: '1234' -> 通过
   *  value: [1, 2, 3, 4, 5, 6] ->  不能大于5项
   * ]
   * @inner
   * @param {object} rule 校验规则
   * @param {number} rule.value 最大长度
   * @param {string|number[]} value 需要验证的字符串
   * @param {function} callback 完成回调
   * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回不能大于（最大长度）项
   */


  function maxLength(rule, value, callback) {
    if (value && value.length > rule.value) {
      callback('不能大于' + rule.value + '项');
    } else {
      callback();
    }
  }
  /**
   * 验证标签最大长度
   * 
   * Note: 默认最大长度为5，标签以英文逗号分隔
   * 
   * @example [
   *  value: '1,2,3' -> 通过
   *  value:'1,2,3,4,5,6,7,8' ->  备注标签最多5项
   * ]
   * @inner
   * @param {object} rule 校验规则（暂时无用）
   * @param {string} value 需要验证的字符串
   * @param {function} callback 完成回调
   * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回备注标签最多5项
   */


  function tagMaxLength(rule, value, callback) {
    if (value && value.split(",").length > 5) {
      callback("备注标签最多5项");
    } else {
      callback();
    }
  }
  /**
   * 验证日期差
   * 
   * Note: value的元素类型需要时moment类型，需要使用moment.diff比较函数,第一个元素日期要小于第二个元素日期
   * 
   * @example [
   *  rule: { days: 5 }
   *  value: [moment('2019-01-01'), moment('2019-01-03')] -> 通过
   *  value：[moment('2019-01-01'), moment('2019-01-13')] -> 日期差不能超过5天
   * ]
   * @inner
   * @param {object} rule 校验规则
   * @param {number} rule.days 日期差（天数）
   * @param {array} value 需要验证的日期 [min, max]
   * @param {function} callback 完成回调
   * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回日期差不能超过(days)天
   */


  function dateRangePicked(rule, value, callback) {
    var days = rule.days;
    var diffDays = value[1].diff(value[0], "days");

    if (diffDays > days) {
      callback("日期差不能超过" + days + "天");
    } else {
      callback();
    }
  }
  /**
   * 验证日期差
   * 
   * Note: value的类型是moment类型，需要使用moment.diff比较函数,规则的比较类型不传或者传错，则不比较
   * 
   * @example [
   *   rule: { date: [moment('2019-01-01'), type: 'bigger' }
   *   value: moment('2019-02-01') -> 通过
   *   value：moment('2018-01-01') -> 结束时间必须大于开始时间！
   * ]
   * 
   * @inner
   * @param {object} rule 校验规则
   * @param {object} rule.date 日期(moment日期)
   * @param {string} rule.type 比较类型 bigger|smaller
   * @param {object} value 需要验证的日期(moment日期)
   * @param {function} callback 完成回调
   * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回日期差不能超过(days)天
   */


  function dateCompare(rule, value, callback) {
    var date = rule.date;
    var type = rule.type;

    if (value && date) {
      var diff = value.diff(date);

      if (type === "bigger") {
        if (diff < 0) {
          callback("结束时间必须大于开始时间！");
        } else {
          callback();
        }
      } else if (type == "smaller") {
        if (diff > 0) {
          callback("开始时间必须小于结束时间！");
        } else {
          callback();
        }
      } else {
        callback();
      }
    } else {
      callback();
    }
  }

  var rules = {
    validateSpecialCharacters: validateSpecialCharacters,
    checkIP: checkIP,
    validatePort: validatePort,
    checkIPorDomain: checkIPorDomain,
    checkIPCust: checkIPCust,
    validateToNextPassword: validateToNextPassword,
    checkWeekPassword: checkWeekPassword,
    checkMobile: checkMobile,
    checkEmail: checkEmail,
    checkIDCard: checkIDCard,
    ranges: ranges,
    fileSize: fileSize,
    integer: integer,
    maxLength: maxLength,
    tagMaxLength: tagMaxLength,
    dateRangePicked: dateRangePicked,
    dateCompare: dateCompare
    /*
    remote:(rule,value,callback)=>{
      // console.log(rule,value,callback,aa,bb,cc)
      if(rule.defaultValue != value){
        let name = rule.name
        let params = rule.params?rule.params:{}
        params[rule['name']]=value
        console.log(params)
        new FetchAPI().fetch(rule.value,{
          body:params,
          method:"POST"
          // method:/\/listJson?$/.test(fetchUrl)?'POST':'GET' //兼容listJSON 使用POST请求处理
        }).then((json) => {
          // console.log(json)
          if(json.status){
            if(json.msg){
              callback(json.msg)
            }else{
              callback('该字段系统内已存在！')
            }
          }else {
            callback()
          }
        });
      }else {
        callback()
      }
    },
    */

  };

  var index$3 = /*#__PURE__*/Object.freeze({
    rules: rules
  });

  exports.FetchUtils = index;
  exports.BIZCodeUtils = index$1;
  exports.DictUtils = index$2;
  exports.ValidatorUtils = index$3;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
