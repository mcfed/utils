/**
 * @Date:   2017-09-07T09:45:33+08:00
 * @Email:  jaxchow@gmail.com
 * @Last modified time: 2018-03-13T11:45:29+08:00
 */
import {stringify} from 'qs'

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

function processPraramItem(object){
    for(var key in object){
      if (object[key] instanceof Array ){
        if(object[key].length!==0){
          object[key]=JSON.stringify(object[key])
        }else{
          object[key]=undefined
        }
      }else{
        if(object[key]===""){
          object[key]=undefined
        }
      }
    }
    return object
}


function processParams(object){
  let {column,current,showQuickJumper,pageSize,total,field,order,pageSizeOptions,showSizeChanger,columnKey,...other}=object
  var body={
    currentPage:current,
    totalCount:total,
    pageSize,
    ...other
  }
  return processPraramItem(body)
}
const defaults = {
  credentials: 'include',
  mode: 'cors',
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    'Access-Control-Allow-Origin': '*',
  }
}

export function toData(json){
  if(json.code===0){
      return json.data
    }else{
      return json
    }
}

export function fetchCatch(error){
    return error
}

export function fetchRequest(url, options) {
  return fetch(url, Object.assign({}, defaults, options)).then(res => {
    if (res.ok === true) {
      return res
    } else {
      var err = new Error(res.statusText)
      err.response = res
      throw err
    }
  }).then(res => {
    if(options.responseType==='arraybuffer'){
      return res
    }else{
      return res.json()
    }
  })
}

export function processBody(options,format){
  if (options && typeof (options.body) === 'object') {
    options.body = processParams(options.body)
  }
  return options
}

export function fetchList(url,options){
  return fetchGet(url,options)
}

export function fetchGet(url, options) {
  options=processBody(options)
  if (options && options.body && options.body !== "") {
    url = [stringifyURL(url,options.body),stringify(options.body)].join("?")
  }
  options && delete options.body
  return fetchRequest(url, Object.assign({},{
    method: 'GET'
  }, options))
}

export function fetchPost(url, options) {

  // options=processBody(options)
  if (options && options.body && options.body !== "") {
    options.body=JSON.stringify(options.body)
  }
  // console.log(options)
  return fetchRequest(stringifyURL(url,options.body), Object.assign({
    headers: new Headers({
        'Content-Type': 'application/json'
    }),
    method: 'POST'
  }, options))
}

export function fetchPut(url,options){
  return fetchPost(url,
    Object.assign({},options,{
      method:'PUT'
    })
  )
}

export function fetchUpload(url,options){

  return fetchPost(url,Object.assign({},options,{
    // headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'}
  }))
}

export function fetchDownload(url,options){
  return fetchGet(url, Object.assign({},options,{
    responseType:'arraybuffer',
    headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'},
  })).then(res => {
    var blob = new Blob([res.data]);
    var a = document.createElement('a');
    var url = window.URL.createObjectURL(blob);
    var filename = res.headers.get('Content-Disposition')||"";
    a.href = url;
    a.download = decodeURI(filename.replace("attachment;filename=",""));
    a.click();
    window.URL.revokeObjectURL(url);
  })
}
