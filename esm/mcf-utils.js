import { stringify } from 'qs';
import fetch from 'cross-fetch';

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

  return str.replace(/:([A-Z|a-z]+)/gi, function (match, p1) {
    var replacement = options[p1];

    if (!replacement) {
      throw new Error('Could not find url parameter ' + p1 + ' in passed options object');
    }

    return replacement;
  });
}

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

var defaults = {
  credentials: 'include',
  mode: 'cors',
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    "X-Requested-With": "XMLHttpRequest",
    'Access-Control-Allow-Origin': '*'
  }
};
var defaultsHeaders = defaults;
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
  // console.log( defaults, options)
  return fetch(url, Object.assign({}, defaults, options)).then(function (res) {
    if (res.ok === true) {
      return res;
    } else if (res.status == 601) {
      window.dispatchEvent(new CustomEvent('login_out'));
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
    if (options.responseType === 'arraybuffer') {
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
    url = [stringifyURL(url, options.body), stringify(options.body)].join("?");
  }

  options && delete options.body;
  return fetchRequest(url, Object.assign({}, {
    method: 'GET'
  }, options));
}
function fetchPost(url, options) {
  url = stringifyURL(url, options.body); // options=processBody(options)

  if (options && options.body && options.body !== "") {
    options.body = JSON.stringify(options.body);
  } // console.log(options)


  return fetchRequest(url, Object.assign({
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    method: 'POST'
  }, options));
}
function fetchPut(url, options) {
  return fetchPost(url, Object.assign({}, options, {
    method: 'PUT'
  }));
}
function fetchDelete(url, options) {
  return fetchPost(url, Object.assign({}, options, {
    method: 'DELETE'
  }));
}
function fetchGraphql(url, options, querys) {
  return fetchPost(url, Object.assign({}, options, {
    credentials: 'include',
    // include, same-origin, *omit
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    },
    method: 'POST',
    // *GET, POST, PUT, DELETE, etc.
    mode: 'cors' // no-cors, cors, *same-origin

  }));
}
function fetchGraphqlList(url, options, querys) {
  return fetchGraphql(url, options, querys).then(function (result) {
    return result.data.result;
  });
}
function fetchUpload(url, options) {
  return fetchPost(url, Object.assign({}, options, {// headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'}
  }));
}
function fetchDownload(url, options) {
  return fetchGet(url, Object.assign({}, options, {
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    }
  })).then(function (res) {
    return res.blob().then(function (blob) {
      if (blob) {
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(blob);
        var filename = res.headers.get('Content-Disposition') || "";
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
        console.error('no data!');
        return false;
      }
    });
  });
}

var index = /*#__PURE__*/Object.freeze({
  defaultsHeaders: defaultsHeaders,
  toData: toData,
  fetchCatch: fetchCatch,
  fetchRequest: fetchRequest,
  processBody: processBody,
  fetchList: fetchList,
  fetchGet: fetchGet,
  fetchPost: fetchPost,
  fetchPut: fetchPut,
  fetchDelete: fetchDelete,
  fetchGraphql: fetchGraphql,
  fetchGraphqlList: fetchGraphqlList,
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

var rules = {
  checkIP: function checkIP(rule, value, callback) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

    if (!reg.test(value)) {
      callback("Ip地址不正确");
    } else {
      callback();
    }
  },
  checkIPCust: function checkIPCust(rule, value, callback) {
    var reg = /^[0-9a-fA-F\\.\\:////]{2,39}$/;

    if (!reg.test(value)) {
      callback("Ip地址不正确");
    } else {
      callback();
    }
  },
  checkWeekPassword: function checkWeekPassword(rule, value, callback) {
    if (/^\d{6}$/.test(value)) {
      callback('密码为弱密码！');
    } else {
      callback();
    }
  },

  /**
   * [checkMobile 手机号码格式]
   * @param  {[type]}   rule     [description]
   * @param  {[type]}   value    [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  checkMobile: function checkMobile(rule, value, callback) {
    var rexp = /^(0?1[123456789]\d{9})$/;

    if (!rexp.test(value)) {
      callback('手机号码格式不正确！');
    } else {
      callback();
    } // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应

  },
  checkIDCard: function checkIDCard(rule, value, callback) {
    var rexp = /(^\d{17}(\d|x|X)$)/i;

    if (!rexp.test(value)) {
      callback('身份证号码格式不正确！');
    } else {
      callback();
    }
  },
  ranges: function ranges(rule, value, callback) {
    if (rule.ranges instanceof Array && rule.ranges.length === 2) {
      if (rule.ranges[0] > value || rule.ranges[1] < value) {
        callback("\u8BF7\u8F93\u5165\u533A\u95F4\u503C".concat(JSON.stringify(rule.ranges)));
      } else {
        callback();
      }
    } else {
      callback();
    }
  },
  fileSize: function fileSize(rule, value, callback) {
    if (value.file && value.file.size > rule.fileSize) {
      callback("\u6587\u4EF6\u5927\u5C0F\u4E0D\u8D85\u8FC7 ".concat(rule.fileSize));
    } else {
      callback();
    }
  },
  integer: function integer(rule, value, callback) {
    var rexp = /^([1-9]\d*|[0]{0,1})$/;

    if (value instanceof Array) {
      value.map(function (it, idx) {
        if (!rexp.test(it)) {
          return callback('必须为正整数！');
        }
      });
      return callback();
    } else if (typeof value == "string") {
      if (!rexp.test(value)) {
        return callback('必须为正整数！');
      } else {
        return callback();
      }
    }

    return callback();
  },
  maxLength: function maxLength(rule, value, callback) {
    if (value && value.length > rule.value) {
      callback('不能大于' + rule.value + '项');
    } else {
      callback();
    }
  },
  tagMaxLength: function tagMaxLength(rule, value, callback) {
    if (value && value.split(",").length > 5) {
      callback("备注标签最多5项");
    } else {
      callback();
    }
  },

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
  dateRangePicked: function dateRangePicked(rule, value, callback) {
    var days = rule.days;
    var diffDays = value[1].diff(value[0], "days");

    if (diffDays > days) {
      callback("日期差不能超过" + days + "天");
    } else {
      callback();
    }
  },
  dateCompare: function dateCompare(rule, value, callback) {
    var date = rule.date;
    var type = rule.type;

    if (value && date) {
      var diff = value.diff(date);

      if (type == "bigger") {
        if (diff < 0) {
          callback("结束时间必须大于开始时间！");
        }
      } else if (type == "smaller") {
        if (diff > 0) {
          callback("开始时间必须小于结束时间！");
        }
      }
    } else {
      callback();
    }
  }
};

var index$3 = /*#__PURE__*/Object.freeze({
  rules: rules
});

export { index as FetchUtils, index$1 as BIZCodeUtils, index$2 as DictUtils, index$3 as ValidatorUtils };
