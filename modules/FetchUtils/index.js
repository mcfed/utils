/**
 * @Date:   2017-09-07T09:45:33+08:00
 * @Email:  jaxchow@gmail.com
 * @Last modified time: 2018-03-13T11:45:29+08:00
 * @module FetchUtils
 */
import { stringify } from "qs";

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
export function stringifyURL(str, options) {
  if (!str) {
    return str;
  }

  return str.replace(/:([A-Z|a-z]+)/gi, function(match, p1) {
    var replacement = options[p1];
    if (!replacement) {
      throw new Error(
        "Could not find url parameter " + p1 + " in passed options object"
      );
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
export function processGraphqlParams(params = {}) {
  const {
    column,
    current,
    showQuickJumper,
    pageSize,
    total,
    field,
    pageSizeOptions,
    showSizeChanger,
    columnKey,
    order,
    ...otherParam
  } = params;
  return Object.assign(
    {},
    otherParam,
    current ? { start: (current - 1) * pageSize || 0 } : { start: 0 },
    pageSize ? { end: current * pageSize - 1 || 9 } : { end: 0 },
    order
      ? {
          order: order && order.replace(/end$/, "")
        }
      : {},
    columnKey
      ? {
          orderBy: columnKey
        }
      : {}
  );
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
export function processPraramItem(object) {
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
  let {
    column,
    current,
    showQuickJumper,
    pageSize,
    total,
    field,
    pageSizeOptions,
    showSizeChanger,
    ...other
  } = object;
  var body = {
    currentPage: current,
    totalCount: total,
    pageSize,
    ...other
  };
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
const defaults = {
  credentials: "include",
  mode: "cors",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    "X-Requested-With": "XMLHttpRequest",
    "Access-Control-Allow-Origin": "*",
    Pragma: "no-cache"
  }
};
export const defaultsHeaders = defaults;

/**
 * 返回传入的错误
 *
 * @param {object} error
 * @return {object} Desc: error
 */
export function fetchCatch(error) {
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
export function fetchRequest(url, options) {
  if (global.fetch) {
    if (global.fetch.responseProcess) {
      return fetch(url, Object.assign({}, defaults, options)).then(
        global.fetch.responseProcess
      );
    } else {
      return fetch(url, Object.assign({}, defaults, options))
        .then(res => {
          if (res.ok === true) {
            return res;
          } else if (res.status == 601 || res.status == 401) {
            global.dispatchEvent &&
              global.dispatchEvent(new CustomEvent("login_out"));
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
        })
        .then(res => {
          if (options.responseType === "arraybuffer") {
            return res;
          } else if (res.code) {
            return res;
          } else {
            return res.json();
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  } else {
    console.error(`
      import fetch from 'cross-fetch'  // import you fetch utils
      global.fetch = fetch
    `);
  }
}

/**
 * 处理请求体
 *
 * @param {object} options
 * @param {object} options.body
 * @return {object} Desc: 返回处理过body的options
 */
export function processBody(options, format) {
  if (options && typeof options.body === "object") {
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
export function fetchList(url, options) {
  return fetchGet(url, options);
}

/**
 * 获取数据（GET）
 *
 * @param {string} url 请求链接
 * @param {object} options 请求选项参数
 */
export function fetchGet(url, options) {
  options = processBody(options);
  if (options && options.body && options.body !== "") {
    url = [stringifyURL(url, options.body), stringify(options.body)].join(
      url.indexOf("?") > 0 ? "&" : "?"
    );
  }
  options && delete options.body;
  return fetchRequest(
    url,
    Object.assign(
      {},
      {
        method: "GET"
      },
      options
    )
  );
}

/**
 * 更新数据（POST）
 *
 * @param {string} url 请求链接
 * @param {object} options 请求选项参数
 */
export function fetchPost(url, options) {
  url = stringifyURL(url, options.body);
  // options=processBody(options)
  if (options && options.body && options.body !== "") {
    options.body = JSON.stringify(options.body);
  }
  // console.log(options)
  return fetchRequest(
    url,
    Object.assign(
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Pragma: "no-cache"
        },
        method: "POST"
      },
      options
    )
  );
}

/**
 * 更新数据（PUT）
 *
 * @param {string} url 请求链接
 * @param {object} options 请求选项参数
 */
export function fetchPut(url, options) {
  return fetchPost(
    url,
    Object.assign({}, options, {
      method: "PUT"
    })
  );
}

/**
 * 删除数据（DELETE）
 *
 * @param {string} url 请求链接
 * @param {object} options 请求选项参数
 */
export function fetchDelete(url, options) {
  return fetchPost(
    url,
    Object.assign({}, options, {
      method: "DELETE"
    })
  );
}

/**
 * 获取数据（Graphql接口）
 *
 * @param {string} url 请求链接
 * @param {object} options 请求选项参数
 */
export function fetchGraphql(url, options, querys) {
  return fetchPost(
    url,
    Object.assign({}, options, {
      body:
        options && options.body
          ? {
              operationName: options.body.operationName,
              query: options.body.query,
              variables: processGraphqlParams(options.body.variables)
            }
          : {},
      credentials: "include", // include, same-origin, *omit
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Pragma: "no-cache"
      },
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors" // no-cors, cors, *same-origin
    })
  );
}

/**
 * 获取数据（Graphql接口，返回去掉data.result的外包装）
 *
 * @param {string} url 请求链接
 * @param {object} options 请求选项参数
 */
export function fetchGraphqlAsResult(url, options, querys) {
  return fetchGraphql(url, options, querys).then(result => result.data.result);
}

/**
 * 获取数据(Graphql列表接口，返回去掉data.result的外包装)
 *
 * @param {string} url 请求链接
 * @param {object} options 请求选项参数
 */
export function fetchGraphqlList(url, options, querys) {
  return fetchGraphqlAsResult(url, options, querys);
}

/**
 * 上传数据
 *
 * @param {string} url 请求链接
 * @param {object} options 请求选项参数
 */
export function fetchUpload(url, options) {
  return fetchPost(
    url,
    Object.assign({}, options, {
      // headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'}
    })
  );
}

/**
 * 下载文件流
 *
 * @param {string} url 请求链接
 * @param {object} options 请求选项参数
 */
export function fetchDownload(url, options) {
  return fetchGet(
    url,
    Object.assign({}, options, {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "multipart/form-data;charset=UTF-8",
        Pragma: "no-cache"
      }
    })
  ).then(res =>
    res.blob().then(blob => {
      if (blob) {
        var a = document.createElement("a");
        var url = window.URL.createObjectURL(blob);
        var filename = res.headers.get("Content-Disposition") || "";
        document.body.appendChild(a);
        a.href = url;
        a.download = decodeURI(filename.replace("attachment;filename=", ""));
        a.click();
        //修正Firefox 无法下载问题
        setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);

        return true;
      } else {
        console.error("no data!");
        return false;
      }
    })
  );
}
