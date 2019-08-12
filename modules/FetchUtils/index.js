"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var qs_1 = require("qs");
var lodash = __importStar(require("lodash"));
// 默认的Headers
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
// notes: 所有自定义的的对象或常规对象上自定义挂载，都使用(<any>object)强制转换 不做校验
var FetchUtilsBase = /** @class */ (function () {
    function FetchUtilsBase() {
    }
    // 获取请求
    FetchUtilsBase.fetchRequest = function (url, options) {
        if (!this.checkFetch()) {
            return Promise.resolve({ code: -1, message: 'fetch not found' });
        }
        var fetchResponseProcess = this.getFetchResponseProcess();
        var responseProcessFunction = this.defauleFetchResponseProcess(options);
        if (fetchResponseProcess) {
            responseProcessFunction = fetchResponseProcess;
        }
        return fetch(url, Object.assign({}, defaults, options)).then(responseProcessFunction)
            .catch(function (e) {
            return {
                code: -1,
                message: "request aborted"
            };
        });
    };
    // 默认的处理返回数据函数
    FetchUtilsBase.defauleFetchResponseProcess = function (options) {
        return function (res) {
            if (res.ok === true) {
                if (options.responseType === "arraybuffer" || res.code) {
                    return Promise.resolve(res);
                }
                return res.json();
            }
            return Promise.resolve({
                code: res.status,
                message: res.statusText,
            });
        };
    };
    // 检验fetch 是否存在
    FetchUtilsBase.checkFetch = function () {
        // global绑定判断-兼容判断
        if (global.fetch && typeof global.fetch === 'function') {
            return true;
        }
        // 抛错
        console.error("\n        import fetch from 'cross-fetch'  // import you fetch utils\n        global.fetch = fetch\n    ");
        return false;
    };
    // 获取请求的特殊处理函数
    FetchUtilsBase.getFetchResponseProcess = function () {
        // global绑定-兼容
        if (global.fetch && global.fetch.responseProcess && typeof global.fetch.responseProcess === 'function') {
            return global.fetch.responseProcess;
        }
        // 返回-undefined
        return;
    };
    FetchUtilsBase.config = undefined;
    return FetchUtilsBase;
}());
var FetchUtils = /** @class */ (function (_super) {
    __extends(FetchUtils, _super);
    function FetchUtils() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // 返回错误
    FetchUtils.fetchCatch = function (error) {
        return error;
    };
    // 获取Get请求类型资源数据
    FetchUtils.fetchGet = function (url, options) {
        options = this.processBody(options);
        if (options && options.body && options.body !== "") {
            url = [this.stringifyURL(url, options.body), qs_1.stringify(options.body)].join(url.indexOf("?") > 0 ? "&" : "?");
            url = url.replace(/\?$/, '');
        }
        return this.fetchRequest(url, this.combineOptions(options, {
            method: "GET"
        }));
    };
    // 获取列表
    FetchUtils.fetchList = function (url, options) {
        return this.fetchGet(url, options);
    };
    // 更新数据（POST）
    FetchUtils.fetchPost = function (url, options) {
        if (options && options.body) {
            url = this.stringifyURL(url, options.body);
        }
        if (options && options.body && options.body !== "") {
            options.body = JSON.stringify(options.body);
        }
        return this.fetchRequest(url, this.combineOptions(options, {
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                Pragma: "no-cache"
            },
            method: "POST"
        }));
    };
    // 更新数据（PUT）
    FetchUtils.fetchPut = function (url, options) {
        return this.fetchPost(url, this.combineOptions(options, {
            method: "PUT"
        }));
    };
    // 删除数据（DELETE）
    FetchUtils.fetchDelete = function (url, options) {
        return this.fetchPost(url, this.combineOptions(options, {
            method: "DELETE"
        }));
    };
    // 获取数据（Graphql接口）
    FetchUtils.fetchGraphql = function (url, options) {
        options = this.combineOptions(options, {
            credentials: "include",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                Pragma: "no-cache"
            },
            method: "POST",
            mode: "cors" // no-cors, cors, *same-origin
        });
        if (options && options.body) {
            options.body = lodash.pick(options.body, ['operationName', 'query', 'variables']);
        }
        return this.fetchPost(url, options);
    };
    // 获取数据（Graphql接口，返回去掉data.result的外包装）
    FetchUtils.fetchGraphqlAsResult = function (url, options) {
        return this.fetchGraphql(url, options).then(function (res) { return res.data.result; }); // 无法确定是哪种类型的数据，需要根据数据类型处理
    };
    // 获取数据(Graphql列表接口，返回去掉data.result的外包装)
    FetchUtils.fetchGraphqlList = function (url, options) {
        if (options && options.body) {
            options.body.variables = this.processGraphqlParams(options.body.variables);
        }
        return this.fetchGraphqlAsResult(url, options);
    };
    // 上传数据
    FetchUtils.fetchUpload = function (url, options) {
        if (options && options.body) {
            url = this.stringifyURL(url, options.body);
        }
        var params = new FormData();
        for (var i in options.body) {
            params.append(i, options.body[i]);
        }
        return this.fetchRequest(url, this.combineOptions(options, {
            method: "POST",
            body: params
        }));
    };
    // 下载文件流
    FetchUtils.fetchDownload = function (url, options) {
        return this.fetchGet(url, this.combineOptions(options, {
            responseType: "arraybuffer",
            headers: {
                "Content-Type": "multipart/form-data;charset=UTF-8",
                Pragma: "no-cache"
            }
        })).then(function (res) {
            if (res.blob && typeof res.blob === 'function') {
                return res.blob().then(function (blob) {
                    if (blob) {
                        var a = document.createElement("a");
                        var url = window.URL.createObjectURL(blob);
                        var filename = res.headers.get("Content-Disposition") || "";
                        document.body.appendChild(a);
                        a.href = url;
                        a.download = decodeURI(filename.replace("attachment;filename=", ""));
                        a.click();
                        //修正Firefox 无法下载问题
                        setTimeout(function () {
                            document.body.removeChild(a);
                            window.URL.revokeObjectURL(url);
                        }, 100);
                        return Promise.resolve({ code: 0, message: 'success' });
                    }
                    else {
                        return Promise.resolve({ code: 1, message: 'fetch download fail' });
                    }
                });
            }
            return Promise.resolve({ code: 1, message: 'fetch download fail' });
        });
    };
    // 合并Options
    FetchUtils.combineOptions = function (options, newOptions) {
        if (options === void 0) { options = {}; }
        if (newOptions === void 0) { newOptions = {}; }
        var result = lodash.merge({}, options, newOptions);
        return result;
    };
    // 格式字符串Url重的/:id=>/1,用body={ id: 1 }
    FetchUtils.stringifyURL = function (str, options) {
        if (!str) {
            return str;
        }
        return str.replace(/:([A-Z|a-z]+)/gi, function (match, p1) {
            // @ts-ignore
            var replacement = options[p1];
            if (replacement === undefined) {
                throw new Error("Could not find url parameter " + p1 + " in passed options object");
            }
            return replacement;
        });
    };
    // 处理graphql参数
    FetchUtils.processGraphqlParams = function (params) {
        if (params === void 0) { params = {}; }
        var column = params.column, _a = params.current, current = _a === void 0 ? 1 : _a, showQuickJumper = params.showQuickJumper, _b = params.pageSize, pageSize = _b === void 0 ? 10 : _b, total = params.total, field = params.field, pageSizeOptions = params.pageSizeOptions, showSizeChanger = params.showSizeChanger, columnKey = params.columnKey, order = params.order, otherParam = __rest(params, ["column", "current", "showQuickJumper", "pageSize", "total", "field", "pageSizeOptions", "showSizeChanger", "columnKey", "order"]);
        return Object.assign({}, otherParam, {
            start: (current - 1) * pageSize || 0,
            end: current * pageSize - 1 || 9
        }, order
            ? {
                order: order && order.replace(/end$/, "")
            }
            : {}, columnKey
            ? {
                orderBy: columnKey
            }
            : {});
    };
    // 处理每个参数
    FetchUtils.processPraramItem = function (object) {
        for (var key in object) {
            // @ts-ignore
            if (object[key] instanceof Array) {
                // @ts-ignore
                if (object[key].length !== 0) {
                    // @ts-ignore
                    object[key] = JSON.stringify(object[key]);
                }
                else {
                    // @ts-ignore
                    object[key] = undefined;
                }
            }
            else {
                // @ts-ignore
                if (object[key] === "") {
                    // @ts-ignore
                    object[key] = undefined;
                }
            }
        }
        return object;
    };
    // 处理参数
    FetchUtils.processParams = function (object) {
        var column = object.column, current = object.current, showQuickJumper = object.showQuickJumper, pageSize = object.pageSize, total = object.total, field = object.field, pageSizeOptions = object.pageSizeOptions, showSizeChanger = object.showSizeChanger, other = __rest(object, ["column", "current", "showQuickJumper", "pageSize", "total", "field", "pageSizeOptions", "showSizeChanger"]);
        var body = __assign({ currentPage: current, totalCount: total, pageSize: pageSize }, other);
        return this.processPraramItem(body);
    };
    // 处理参数
    FetchUtils.processBody = function (options) {
        if (options && typeof options.body === "object") {
            options.body = this.processParams(options.body);
        }
        return options;
    };
    FetchUtils.defaultsHeaders = defaults;
    return FetchUtils;
}(FetchUtilsBase));
exports.default = FetchUtils;
