import { stringify } from 'qs';

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

var realFetch = require('node-fetch');
module.exports = function(url, options) {
	if (/^\/\//.test(url)) {
		url = 'https:' + url;
	}
	return realFetch.call(this, url, options);
};

if (!global.fetch) {
	global.fetch = module.exports;
	global.Response = realFetch.Response;
	global.Headers = realFetch.Headers;
	global.Request = realFetch.Request;
}

function processMoment2DateStr(object) {
  for (var key in object) {
    if (object[key] instanceof Array) {
      if (object[key].length !== 0) {
        object[key] = JSON.stringify(processMoment2DateStr(object[key]));
      } else {
        object[key] = undefined;
      }
    }
  }

  return object;
}

function processParams(object) {
  var column = object.column,
      current = object.current,
      pageSize = object.pageSize,
      total = object.total,
      field = object.field,
      order = object.order,
      pageSizeOptions = object.pageSizeOptions,
      showSizeChanger = object.showSizeChanger,
      columnKey = object.columnKey,
      other = _objectWithoutProperties(object, ["column", "current", "pageSize", "total", "field", "order", "pageSizeOptions", "showSizeChanger", "columnKey"]);

  var body = _objectSpread({
    currentPage: current,
    totalCount: total,
    pageSize: pageSize
  }, other);

  return processMoment2DateStr(body);
}

var defaults = {
  credentials: 'include' // mode: 'cors',
  // headers: {
  //   "Content-Type": "application/json",
  //   "X-Requested-With": "XMLHttpRequest",
  //   'Access-Control-Allow-Origin': '*',
  // }

};
function fetchRequest(url, options) {
  return fetch(url, Object.assign({}, defaults, options)).then(function (res) {
    if (res.status === 403) ; //global.invokeMethod('RefreshMainPage')
    // yield put({type:"FETCH_SUCCESS",payload:{url,fetching:false}});


    if (res.ok === true) {
      return res;
    } else {
      var err = new Error(res.statusText);
      err.response = res; // yield put({type:"FETCH_FAILD",payload:{url,fetching:false}});
      //message.error(err.response.url+"|"+err.response.statusText+"|"+err.response.status,5,null,true)

      throw err;
    }
  }).then(function (res) {
    //修正后台不返回或返回不是JSON时，为空处理
    // console.log(res.headers.get('content-type'))
    // if (res.headers.get('content-type') === 'application/json; charset=utf-8') {
    return res.json(); // } else {
    // return res
    // }
  }).then(function (results) {
    if (results.code === 0) {
      return results.data;
    } else {
      return results.code;
    }
  });
}
function fetchGet(url, options) {
  if (options && _typeof(options.body) === 'object') {
    options.body = stringify(processParams(options.body));
  }

  if (options && options.body && options.body !== "") {
    url = [url, options.body].join("?");
  }

  options && delete options.body;
  return fetchRequest(url, Object.assign({
    method: 'GET'
  }, options));
}
function fetchPost(url, options) {
  if (options && _typeof(options.body) === 'object') {
    options.body = JSON.stringify(processParams(options.body));
  }

  return fetchRequest(url, Object.assign({
    method: 'Post'
  }, options));
}

var index = /*#__PURE__*/Object.freeze({
  fetchRequest: fetchRequest,
  fetchGet: fetchGet,
  fetchPost: fetchPost
});

var codeData = [
    {"value":601,"label":"没有权限"},
    {"value":1,"label":"操作成功"},
    {"value":2,"label":"操作失败"}
];

function getBIZLabel(value) {
  var label = '未知';

  try {
    codeData.forEach(function (arr) {
      if (arr.value === value) {
        label = arr.label;
        throw 'Finish and value = ' + label;
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

var dbType = [
	{
		value: "all",
		label: "通用"
	},
	{
		value: "sqlserver",
		label: "SQL Server"
	},
	{
		value: "oracle",
		label: "Oracle"
	},
	{
		value: "mysql",
		label: "MySQL"
	},
	{
		value: "db2",
		label: "DB2"
	}
];
var riskLevel = [
	{
		value: "1",
		label: "极低"
	},
	{
		value: "2",
		label: "低"
	},
	{
		value: "3",
		label: "中"
	},
	{
		value: "4",
		label: "高"
	},
	{
		value: "5",
		label: "极高"
	}
];
var status = [
	{
		value: "0",
		label: "停用"
	},
	{
		value: "1",
		label: "启用"
	}
];
var payload = [
	{
		value: "regex",
		label: "正则表达式"
	}
];
var ruleDispose = [
	{
		value: "-1",
		label: "风险等级"
	},
	{
		value: "5",
		label: "阻断"
	},
	{
		value: "1",
		label: "通行"
	}
];
var cyc = [
	{
		value: "s",
		label: "秒"
	},
	{
		value: "min",
		label: "分"
	}
];
var action = [
	{
		value: "2",
		label: "告警"
	},
	{
		value: "4",
		label: "阻断行为"
	},
	{
		value: "5",
		label: "阻断连接"
	}
];
var auditLevel = [
	{
		value: "4",
		label: "高"
	},
	{
		value: "3",
		label: "中"
	},
	{
		value: "2",
		label: "低"
	}
];
var sqlType = [
	{
		value: "false",
		label: "sql白名单"
	},
	{
		value: "true",
		label: "sql黑名单"
	}
];
var runMode = [
	{
		value: "1",
		label: "学习"
	},
	{
		value: "2",
		label: "模拟"
	},
	{
		value: "3",
		label: "正式"
	}
];
var riskScope = [
	{
		value: "3",
		label: "学习模式"
	},
	{
		value: "2",
		label: "模拟启用"
	},
	{
		value: "1",
		label: "正式启用"
	},
	{
		value: "0",
		label: "关闭"
	}
];
var ruleSource = [
	{
		value: "0",
		label: "系统规则"
	},
	{
		value: "1",
		label: "自定义规则"
	}
];
var dictData = {
	dbType: dbType,
	riskLevel: riskLevel,
	status: status,
	payload: payload,
	ruleDispose: ruleDispose,
	cyc: cyc,
	action: action,
	auditLevel: auditLevel,
	sqlType: sqlType,
	runMode: runMode,
	riskScope: riskScope,
	ruleSource: ruleSource
};

function getDictList(dicName) {
  // console.log(dictData)
  return dictData[dicName] || [];
}
function getDictLabel(dicName, value) {
  var label = '';

  try {
    var map = getDictList(dicName);
    map.forEach(function (arr) {
      if (arr.value === value) {
        label = arr.label;
        throw 'Finish and value = ' + label;
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

export { index as FetchUtils, index$1 as BIZCodeUtils, index$2 as DictUtils };
