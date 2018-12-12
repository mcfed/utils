/**
 * @Date:   2017-09-07T09:45:33+08:00
 * @Email:  jaxchow@gmail.com
 * @Last modified time: 2018-03-13T11:45:29+08:00
 */
import fetch from 'isomorphic-fetch'
import { stringify } from 'qs'
import Moment from 'moment'

function processMoment2DateStr(object){
    for(var key in object){
      if (object[key] instanceof Array ){
        if(object[key].length!==0){
          object[key]=JSON.stringify(processMoment2DateStr(object[key]))
        }else{
          object[key]=undefined
        }
      }
      if(object[key] instanceof Moment ){
          object[key]=object[key].format("YYYY-MM-DD")
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
    if (res.headers.get('content-type') === 'application/json; charset=utf-8') {
      return res.json()
    } else {
      return res
    }
  }).then(results=>{
    if(results.code===0){
      return results.data
    }else{
      alert(results.code)
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
