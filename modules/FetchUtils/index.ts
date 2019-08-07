import { stringify } from "qs";
import fs from "fs";
import path from "path";
import _ from "lodash";

const defaultPathFetchConfigJS = path.join(process.cwd(), '.fetch-config.js')
const defaultPathFetchConfigJSON = path.join(process.cwd(), '.fetch-config.json')
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

// notes: 所有自定义的的对象或常规对象上自定义挂载，都使用(<any>object)强制转换 不做校验

class FetchUtilsBase {
  protected static config:FetchConfig|undefined = undefined;

  static fetchRequest(url:string, options:RequestInit):any {
    if (!this.checkFetch()) { return; }

    const fetch:Function = this.getFetch();
    const fetchResponseProcess:Function|undefined = this.getFetchResponseProcess();
    let responseProcessFunction:Function = this.defauleFetchResponseProcess(options);
    if (fetchResponseProcess) {
      responseProcessFunction = fetchResponseProcess;
    }
    return fetch(
      url, 
      (<any>Object).assign({}, defaults, options)
    ).then(responseProcessFunction).catch((e:Error) => {
      console.error('error: ', e)
      return {
        code: -1,
        message: "request aborted"
      };
    });
  }
  
  // 默认的处理返回数据函数
  protected static defauleFetchResponseProcess(options:RequestInit):Function {
    console.log('-----1-----')
    return (res:Response):any => {
      console.log('-----2-----')

        if (res.ok === true) {
          if (options.responseType === "arraybuffer" || res.code ) {
            return res;
          }
          return res.json();
        }
        if (res.status == 601 || res.status == 401) {
          (<any>global).dispatchEvent && (<any>global).dispatchEvent(new CustomEvent("login_out"));
        }
        return {
          code: res.status,
          message: res.statusText,
        };
      };
  }

  // 获取配置信息
  protected static getFetchConfig():FetchConfig|undefined {
    if (this.config) { return this.config; }
    if (fs.existsSync(defaultPathFetchConfigJS)){
       this.config = require(defaultPathFetchConfigJS);
    } else if (fs.existsSync(defaultPathFetchConfigJSON)){
      try {
        let configString = fs.readFileSync(defaultPathFetchConfigJSON, 'utf8');
        if (!configString || typeof configString !== 'object') { this.config = JSON.parse(configString); } else {
          this.config = configString;
        }
      } catch (error) {
        console.error('解析fetchConfig.json文件出错');
      }
    }
    return this.config;
  }

  // 检验fetch 是否存在
  protected static checkFetch():boolean {
    // 获取配置文件
    const fetchCopnfig = this.getFetchConfig();

    // 配置文件判断-优先
    if (fetchCopnfig && fetchCopnfig.fetch && typeof fetchCopnfig.fetch === 'function' ) { return true; }

    // global绑定判断-兼容判断
    if ((<any>global).fetch && typeof (<any>global).fetch === 'function') { return true; }

    // 抛错
    console.error(`
        import fetch from 'cross-fetch'  // import you fetch utils
        global.fetch = fetch
    `);
    return false;
  }

  // 获取fetch
  protected static getFetch():Function {
    // 获取配置文件
    const fetchCopnfig = this.getFetchConfig();

    // 配置文件-优先
    if (fetchCopnfig && fetchCopnfig.fetch && typeof fetchCopnfig.fetch === 'function' ) { return fetchCopnfig.fetch; }

    // global绑定-兼容
    if ((<any>global).fetch && typeof (<any>global).fetch === 'function') { return (<any>global).fetch; }

    // 抛错-可以用自己的fetch
    throw new Error(`fetch is not found`);
  }

  // 获取请求的特殊处理函数
  protected static getFetchResponseProcess():Function|undefined {
    // 获取配置文件
    const fetchCopnfig = this.getFetchConfig();

    // 配置文件-优先
    if (fetchCopnfig && fetchCopnfig.responseProcess && typeof fetchCopnfig.responseProcess === 'function') { return fetchCopnfig.responseProcess; }

    // global绑定-兼容
    if ((<any>global).fetch && (<any>global).fetch.responseProcess && typeof (<any>global).fetch.responseProcess === 'function') { return (<any>global).fetch.responseProcess; }

    // 返回-undefined
    return;
  }
}

export default class FetchUtils extends FetchUtilsBase {
  // 返回错误
  static fetchCatch(error:Error):Error {
    return error;
  }

  // 获取Get请求类型资源数据
  static fetchGet(url:string, options?:RequestInit):any {
    options = this.processBody(options);
    if (options && options.body && options.body !== "") {
      url = [this.stringifyURL(url, options.body), stringify(options.body)].join(
        url.indexOf("?") > 0 ? "&" : "?"
      );
    }
    return this.fetchRequest(
      url,
      this.combineOptions(options, {
        method: "GET"
      }, (o:any) => {

        // GET方法请求不包含body，默认是{}, 所以使用自定义处理方法删除该属性
        delete o.body;
        return o;
      })
    );
  }

  // 获取列表
  static fetchList(url:string, options?:RequestInit):any {
    return this.fetchGet(url, options);
  }

  // 更新数据（POST）
  static fetchPost(url:string, options?:RequestInit):any {
    url = this.stringifyURL(url, options && options.body || {});
    if (options && options.body && options.body !== "") {
      options.body = JSON.stringify(options.body);
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
  static fetchPut(url:string, options?:RequestInit):any {
    return this.fetchPost(
      url,
      this.combineOptions(options, {
        method: "PUT"
      })
    );
  }

  // 删除数据（DELETE）
  static fetchDelete(url:string, options?:RequestInit):any {
    return this.fetchPost(
      url,
      this.combineOptions(options, {
        method: "DELETE"
      })
    );
  }

  // 获取数据（Graphql接口）
  static fetchGraphql(url:string, options?:RequestInit):any {
    return this.fetchPost(
      url,
      this.combineOptions(options, {
        pickBody: ['operationName', 'query', 'variables'],
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

  // 获取数据（Graphql接口，返回去掉data.result的外包装）
  static fetchGraphqlAsResult(url:string, options?:RequestInit):any {
    return this.fetchGraphql(url, options).then((result:GraphqlResponseASResult) => result.data.result);
  }

  // 获取数据(Graphql列表接口，返回去掉data.result的外包装)
  static fetchGraphqlList(url:string, options?:RequestInit):any {
    if (options && options.body) {
      (<any>options.body).variables = this.processGraphqlParams((<any>options.body).variables);
    }
    return this.fetchGraphqlAsResult(url, options);
  }

  // 上传数据
  static fetchUpload(url:string, options:RequestInit):any {
    url = this.stringifyURL(url, options.body);
    let params = new FormData();
    for(let i in (<any>options.body)) {
      params.append(i,(<any>options.body)[i])
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
  static fetchDownload(url:string, options?:RequestInit):any {
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
    ).then((res:Response) => {
      if (!res.blob || typeof res.blob !== 'function') {
        return { code: 1, message: res && (<any>res).message || 'Server Error' }
      }
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
    });
  }

  // 获取Options的 Headers, 应该找到一个声明类型的，但是没找到
  protected static getOptionsHeaders(options:any={}):any {
    return Object.assign({}, { headers: options.headers || {} });
  }

  // 获取Options的 Body
  protected static getOptionsBody(options:any={}):any {
    if (!options.body) { options.body = {} }
    if (options.pickBody && options.pickBody.length) {
      options.body = _.pick(options.body, options.pickBody);
    }
    return Object.assign({}, { body: options.body });
  }

  // 删除多余的参数
  protected static deleteParams(newOptions:any):any {
    delete newOptions.headers;
    delete newOptions.body;
    delete newOptions.pickBody;
    return newOptions;
  }

  // 合并Options
  protected static combineOptions(options:any={}, newOptions:any={}, handleOptions?:Function):any {
    let result =  Object.assign(
      {}, 
      options,
      this.getOptionsHeaders(newOptions),
      this.getOptionsBody(newOptions),
      this.deleteParams(newOptions),
      ...newOptions
    );
    
    // 自定义处理函数
    if (handleOptions && typeof handleOptions === 'function') {
      result = handleOptions(result);
    }

    return result;
  }

  // 格式字符串Url重的/:id=>/1,用body={ id: 1 }
  protected static stringifyURL(str:string, options?:any):string {
    if (!str) { return str; }
  
    return str.replace(/:([A-Z|a-z]+)/gi, function(match, p1) {
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
  protected static processPraramItem(object:any):any {
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

  // 处理参数
  protected static processParams(object:any):any {
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
  public static readonly defaultsHeaders = (<any>Object).assign({}, defaults);

  // 处理参数
  protected static processBody(options?:RequestInit):any {
    if (options && typeof options.body === "object") {
      options.body = this.processParams(options.body);
    }
    return options;
  }
}
