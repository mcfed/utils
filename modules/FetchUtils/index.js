/**
 * @Date:   2017-09-07T09:45:33+08:00
 * @Email:  jaxchow@gmail.com
 * @Last modified time: 2018-03-13T11:45:29+08:00
 */
import { stringify } from 'qs'

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



export function processGraphqlParams(params){
  const {column, current, showQuickJumper, pageSize, total, field,  pageSizeOptions, showSizeChanger,columnKey,order,...otherParam} = params
  return JSON.stringify(JSON.stringify(Object.assign({},otherParam,{
    start:(current-1)* pageSize || 0,
    end:(current)* pageSize-1 || 9,
    order:order && order.replace(/end$/,""),
    orderBy:columnKey
  })))
}

function processPraramItem(object) {
  for (var key in object) {
    if (object[key] instanceof Array) {
      if (object[key].length !== 0) {
        object[key] = JSON.stringify(object[key])
      } else {
        object[key] = undefined
      }
    } else {
      if (object[key] === "") {
        object[key] = undefined
      }
    }
  }
  return object
}


function processParams(object) {
  let { column, current, showQuickJumper, pageSize, total, field,  pageSizeOptions, showSizeChanger,  ...other } = object
  var body = {
    currentPage: current,
    totalCount: total,
    pageSize,
    ...other
  }
  return processPraramItem(body)
}
 const defaults = {
  credentials: 'include',
  mode: 'cors',
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    "X-Requested-With": "XMLHttpRequest",
    'Access-Control-Allow-Origin': '*',
  }
}
export const defaultsHeaders=defaults

export function toData(json) {
  if (json.code === 0) {
    return json.data
  } else {
    return json
  }
}

export function fetchCatch(error) {
  return error
}

export function fetchRequest(url, options) {
  if(fetch){
    return fetch(url, Object.assign({}, defaults, options)).then(res => {
      if (res.ok === true) {
        return res
      } else if(res.status == 601 || res.status == 401) {
        global.dispatchEvent && global.dispatchEvent(new CustomEvent('login_out'))
        return {
          code:res.status,
          message:res.statusText
        }
      } else {
        // var err = new Error(res.statusText)
        // err.response = res
        // throw err
        return {
          code:res.status,
          message:res.statusText
        }
      }
    }).then(res => {
      if (options.responseType === 'arraybuffer') {
        return res
      } else if(res.code){
        return res
      }else{
        return res.json()
      }
    }).catch((e) => {
      console.log(e);
    })
  }else{
    console.error(`
      import fetch from 'cross-fetch'  // import you fetch utils
      global.fetch = fetch
    `)
  }
}

export function processBody(options, format) {
  if (options && typeof (options.body) === 'object') {
    options.body = processParams(options.body)
  }
  return options
}

export function fetchList(url, options) {
  return fetchGet(url, options)
}

export function fetchGet(url, options) {
  options = processBody(options)
  if (options && options.body && options.body !== "") {
    url = [stringifyURL(url, options.body), stringify(options.body)].join("?")
  }
  options && delete options.body
  return fetchRequest(url, Object.assign({}, {
    method: 'GET'
  }, options))
}

export function fetchPost(url, options) {
  url = stringifyURL(url, options.body)
  // options=processBody(options)
  if (options && options.body && options.body !== "") {
    options.body = JSON.stringify(options.body)
  }
  // console.log(options)
  return fetchRequest(url, Object.assign({
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    method: 'POST'
  }, options))
}

export function fetchPut(url, options) {
  return fetchPost(url,
    Object.assign({}, options, {
      method: 'PUT'
    })
  )
}

export function fetchDelete(url,options){
  return fetchPost(url,
    Object.assign({},options,{
      method:'DELETE'
    })
  )
}

export function fetchGraphql(url,options,querys) {
  return fetchPost(url, Object.assign({},options,{
      credentials: 'include', // include, same-origin, *omit
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
  }))
}

export function fetchGraphqlList(url,options,querys) {
  return fetchGraphql(url,options,querys).then((result)=>result.data.result)
}


export function fetchUpload(url,options){

  return fetchPost(url, Object.assign({}, options, {
    // headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'}
  }))
}

export function fetchDownload(url, options) {
  return fetchGet(url, Object.assign({}, options, {
    responseType: 'arraybuffer',
    headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' },
  }))
  .then((res)=>res.blob().then((blob) => {

    if (blob) {
      var a = document.createElement('a');
      var url = window.URL.createObjectURL(blob);
      var filename = res.headers.get('Content-Disposition') || "";
      document.body.appendChild(a);
      a.href = url;
      a.download = decodeURI(filename.replace("attachment;filename=", ""));
      a.click();
      //修正Firefox 无法下载问题
      setTimeout(function(){
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
      }, 100);

      return true
    } else {
      console.error('no data!')
      return false
    }
  }))
}
