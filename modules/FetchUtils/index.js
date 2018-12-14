/**
 * @Date:   2017-09-07T09:45:33+08:00
 * @Email:  jaxchow@gmail.com
 * @Last modified time: 2018-03-13T11:45:29+08:00
 */
import 'isomorphic-fetch'
import {stringify} from 'qs'

function processMoment2DateStr(object){
    for(var key in object){
      if (object[key] instanceof Array ){
        if(object[key].length!==0){
          object[key]=JSON.stringify(processMoment2DateStr(object[key]))
        }else{
          object[key]=undefined
        }
      }
    }
    return object
}


function processParams(object){
  let {column,current,pageSize,total,field,order,pageSizeOptions,showSizeChanger,columnKey,...other}=object
  var body={
    currentPage:current,
    totalCount:total,
    pageSize,
    ...other
  }
  return processMoment2DateStr(body)
}
const defaults = {
  credentials: 'include',
  // mode: 'cors',
  // headers: {
  //   "Content-Type": "application/json",
  //   "X-Requested-With": "XMLHttpRequest",
  //   'Access-Control-Allow-Origin': '*',
  // }
}

export function fetchRequest(url, options) {
  return fetch(url, Object.assign({}, defaults, options)).then(res => {

    if (res.status === 403) {
      //global.invokeMethod('RefreshMainPage')
    }
    // yield put({type:"FETCH_SUCCESS",payload:{url,fetching:false}});
    if (res.ok === true) {
      return res
    } else {
      var err = new Error(res.statusText)
      err.response = res
      // yield put({type:"FETCH_FAILD",payload:{url,fetching:false}});
      //message.error(err.response.url+"|"+err.response.statusText+"|"+err.response.status,5,null,true)
      throw err
    }
  }).then(res => {
    //修正后台不返回或返回不是JSON时，为空处理
    // console.log(res.headers.get('content-type'))
    // if (res.headers.get('content-type') === 'application/json; charset=utf-8') {
      return res.json()
    // } else {
      // return res
    // }
  }).then(results=>{
    if(results.code===0){
      return results.data
    }else{
      return results.code
    }
  })

}

export function fetchGet(url, options) {

  if (options && typeof (options.body) === 'object') {
    options.body = stringify(processParams(options.body))
  }

  if (options && options.body && options.body !== "") {
    url = [url, options.body].join("?")
  }
  options && delete options.body
  return fetchRequest(url, Object.assign({
    method: 'GET'
  }, options))
}

export function fetchPost(url, options) {
  if (options && typeof (options.body) === 'object') {
    options.body = JSON.stringify(processParams(options.body))
  }
  return fetchRequest(url, Object.assign({
    method: 'Post'
  }, options))
}

export function fetchDownload(url){
  fetchRequest(url, Object.assign({
    method: 'GET',
    responseType:'arraybuffer',
    headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'},
  })).then(res => {
    var blob = new Blob([res.data]);
    var a = document.createElement('a');
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = decodeURI(filename);
    a.click();
    window.URL.revokeObjectURL(url);
  })
}