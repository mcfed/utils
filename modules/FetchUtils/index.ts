import { stringify } from "qs";

// 默认的Headers
const defaults:RequestInit = {
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

class FetchUtilsBase {
  protected static config:FetchConfig|undefined = undefined;
  protected static options:RequestInit = {};
  protected static responseProcessFunction:ResponseProcess;

  // 获取请求
  static fetchRequest(url:string, options:RequestInit): PromiseResponse {
    if (!this.checkFetch()) { return Promise.resolve({ code: -2, message: 'fetch not found' }); }

    this.initFetchResponseFunction(options)

    if (options.method === 'GET' || options.method === 'HEAD') {
      delete options.body
    }

    this.options = this.combineOptions(defaults, options)

    return fetch(
      url,
      this.options
    ).then(this.responseProcessFunction).catch((e:Error) => {
      return {
        code: -1,
        message: e.message
      };
    });
  }

  // 初始化fetch的response处理函数
  protected static initFetchResponseFunction(options:RequestInit):void {
    if (!this.responseProcessFunction) {
      const fetchResponseProcess:ResponseProcess|undefined = this.getFetchResponseProcess();
      this.responseProcessFunction = this.defauleFetchResponseProcess(options);
      if (fetchResponseProcess) {
        this.responseProcessFunction = fetchResponseProcess;
      }
    }
  }

  // 默认的处理返回数据函数
  protected static defauleFetchResponseProcess(options:RequestInit):ResponseProcess {
    return (res:Response):PromiseResponse => {
        if (res.ok === true) {
          const contentType = res.headers.get('Content-Type') || 'application/json'
          const isJsonType = contentType && contentType.indexOf('application/json') !== -1
          if (!isJsonType) {
            return Promise.resolve(res);
          } else {
            return res.json();
          }
        }
        return Promise.resolve({
          code: res.status,
          message: res.statusText,
        });
    };
  }

  // 检验fetch 是否存在
  protected static checkFetch():boolean {
    // global绑定判断-兼容判断
    if (global.fetch && typeof global.fetch === 'function') { return true; }

    // 抛错
    console.error(`
        import fetch from 'cross-fetch'  // import you fetch utils
        global.fetch = fetch
    `);
    return false;
  }

  // 获取请求的特殊处理函数
  protected static getFetchResponseProcess():ResponseProcess|undefined {
    // global绑定-兼容
    if (global.fetch && global.fetch.responseProcess && typeof global.fetch.responseProcess === 'function') { return global.fetch.responseProcess; }

    // 返回-undefined
    return;
  }

  // 合并Options
  protected static combineOptions(options:RequestInit={}, newOptions:RequestInit={}):RequestInit {
    return Object.assign({}, defaults, options, newOptions, { headers: Object.assign({}, options.headers, newOptions.headers ) })
  }
}
export default class FetchUtils extends FetchUtilsBase {
  static readonly defaultsHeaders = defaults;

  // 返回错误
  static fetchCatch(error:Error):Error {
    return error;
  }

  // 获取Get请求类型资源数据
  static fetchGet(url:string, options?:RequestInit):PromiseResponse {
    options = this.processBody(options);
    if (options && options.body && options.body !== "") {
      url = [this.stringifyURL(url, options.body), stringify(options.body)].join(
        url.indexOf("?") > 0 ? "&" : "?"
      );
      url = url.replace(/\?$/, '');
    }
    return this.fetchRequest(
      url,
      this.combineOptions(options, {
        method: "GET"
      })
    );
  }

  // 获取列表
  static fetchList(url:string, options?:RequestInit):PromiseResponse {
    return this.fetchGet(url, options);
  }

  // 更新数据（POST）
  static fetchPost(url:string, options?:RequestInit):PromiseResponse {
    if (options && options.body) {
      url = this.stringifyURL(url, options.body);
      if (options.body !== "" && typeof options.body !== 'string') {
        options.body = JSON.stringify(options.body);
      }
    }
    return this.fetchRequest(
      url,
      this.combineOptions(options, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Pragma: "no-cache"
        },
        method: "POST"
      })
    );
  }

  // 更新数据（PUT）
  static fetchPut(url:string, options?:RequestInit):PromiseResponse {
    return this.fetchPost(
      url,
      this.combineOptions(options, {
        method: "PUT"
      })
    );
  }

  // 删除数据（DELETE）
  static fetchDelete(url:string, options?:RequestInit):PromiseResponse {
    return this.fetchPost(
      url,
      this.combineOptions(options, {
        method: "DELETE"
      })
    );
  }

  // 获取数据（Graphql接口）
  static fetchGraphql(url:string, options?:RequestInit):PromiseResponse {

    options = this.combineOptions(options, {
      credentials: "include", // include, same-origin, *omit
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Pragma: "no-cache"
      },
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors" // no-cors, cors, *same-origin
    });
    if (options && options.body) {
      this.pickObject(<any>options.body)
    }

    return this.fetchPost(url, options);
  }

  static pickObject(body:GraphqlBodyObject, keys:Array<string>=[]):GraphqlBodyObject {
    return {
      operationName: body.operationName,
      query: body.query,
      variables: body.variables
    }
  }

  // 获取数据（Graphql接口，返回去掉data.result的外包装）
  static fetchGraphqlAsResult(url:string, options?:RequestInit):PromiseResponse {
    return this.fetchGraphql(url, options).then((res:CommonResponseJson|Response):PromiseResponse => (<any>res).data.result);// 无法确定是哪种类型的数据，需要根据数据类型处理
  }

  // 获取数据(Graphql列表接口，返回去掉data.result的外包装)
  static fetchGraphqlList(url:string, options?:RequestInit):PromiseResponse {
    if (options && options.body) {
      (<any>options.body).variables = this.processGraphqlParams((<any>options.body).variables);
    }
    return this.fetchGraphqlAsResult(url, options);
  }

  // 上传数据
  static fetchUpload(url:string, options?:RequestInit):PromiseResponse {
    if (options && options.body) {
      url = this.stringifyURL(url, options.body);
    }
    let params = new FormData();
    for(let i in (<any>options).body) {
      params.append(i,(<any>options).body[i])
    }

    return this.fetchRequest(
      url,
      this.combineOptions(options, {
        method :"POST",
        body:params
      })
    );
  }

  // 下载文件流
  static fetchDownload(url:string, options?:RequestInit):PromiseResponse {
    return this.fetchGet(
      url,
      this.combineOptions(options, {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "multipart/form-data;charset=UTF-8",
            Pragma: "no-cache"
          }
        }
      )
    ).then((res:any):PromiseResponse => {
      if (res.blob && typeof res.blob === 'function') {
        return res.blob().then((blob:Blob):PromiseResponse => {
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

            return Promise.resolve({ code: 0, message: 'success' });
          } else {
            return Promise.resolve({ code: 1, message: 'fetch download fail, blob is not found' });
          }
        })
      }
      return Promise.resolve({ code: 2, message: 'fetch download fail, response blob is not function' });
    });
  }

  // 格式字符串Url重的/:id=>/1,用body={ id: 1 }
   static stringifyURL(str:string, options?:BodyInit):string {
    if (!str) { return str; }

    return str.replace(/:([A-Z|a-z]+)/gi, function(match, p1) {
      // @ts-ignore
      var replacement = options[p1];
      if (replacement === undefined) {
        throw new Error("Could not find url parameter " + p1 + " in passed options object");
      }

      return replacement;
    });
  }

  // 处理graphql参数
  protected static processGraphqlParams(params:GraphqlParams = {}) {
    const {
      column,
      current=1,
      showQuickJumper,
      pageSize=10,
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
      {
        start: (current - 1) * pageSize || 0,
        end: current * pageSize - 1 || 9
      },
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

  // 处理每个参数
  protected static processPraramItem(object:object):object {
    for (var key in object) {
      // @ts-ignore
      if (object[key] instanceof Array) {
        // @ts-ignore
        if (object[key].length !== 0) {
          // @ts-ignore
          object[key] = JSON.stringify(object[key]);
        } else {
          // @ts-ignore
          object[key] = undefined;
        }
      } else {
        // @ts-ignore
        if (object[key] === "") {
          // @ts-ignore
          object[key] = undefined;
        }
      }
    }
    return object;
  }

  // 处理参数
  protected static processParams(object:defaultPageParams):object {
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
    return this.processPraramItem(body);
  }

  // 处理参数
  protected static processBody(options?:RequestInit):RequestInit|undefined {
    if (options && typeof options.body === "object") {
      (<object>options.body) = this.processParams((<any>options.body));
    }
    return options;
  }
}
