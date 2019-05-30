/**
 * @module ValidatorUtils 校验模块
 */

/**
 * 验证非法字符串
 * 
 * @example 字符串验证的正则表达式为 /^[A-z0-9\\_\\#\\$\\\u4e00-\u9fa5]*$/
 * 
 * @inner
 * @param {string} rule 规则（暂时无用）
 * @param {string} value 需要验证的字符串
 * @param {function} callback 完成回调
 * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回请不要输入非法字符
 */ 
function validateSpecialCharacters(rule, value, callback) {
  let message = '请不要输入非法字符'
  let regEx = /^[A-z0-9\\_\\#\\$\\\u4e00-\u9fa5]*$/
  if (value && !regEx.test(value)) {
    callback(message)
  } else {
    callback()
  }
}

/**
 * 验证IP地址
 * 
 * @example 字符串验证的正则表达式为/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
 * 
 * @inner
 * @param {string} rule 规则（暂时无用）
 * @param {string} value 需要验证的字符串
 * @param {function} callback 完成回调
 * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回IP地址不正确
 */ 
function checkIP(rule, value, callback) {
  var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  if (value && !reg.test(value)) {
    callback("IP地址不正确")
  } else {
    // console.log("callback")
    callback()
  }
}

/**
 * 验证端口
 * 
 * @example 字符串验证的正则表达式为/^(\d)+$/g 且小于等于65535 且大于0
 * 
 * @inner
 * @param {string} rule 规则（暂时无用）
 * @param {string} value 需要验证的字符串
 * @param {function} callback 完成回调
 * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回请输入正确的端口
 */ 
function validatePort(rule, value, callback) {
  let message = '请输入正确的端口'
  var parten = /^(\d)+$/g
  if (!value) {
    callback()
  } else {
    if (parten.test(value) && parseInt(value) <= 65535 && parseInt(value) > 0) {
      callback()
    } else {
      callback(message)
    }
  }
}

/**
 * 验证端口或域名
 * 
 * @example 字符串验证的正则表达式为/^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/ 
 * 
 * @inner
 * @param {string} rule 规则（暂时无用）
 * @param {string} value 需要验证的字符串
 * @param {function} callback 完成回调
 * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回端口或域名不正确！
 */ 
function checkIPorDomain (rule, value, callback) {
  var reg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/
  if (value && !reg.test(value)) {
    callback("端口或域名不正确！")
  } else {
    // console.log("callback")
    callback()
  }
}

/**
 * 验证IP地址
 * 
 * @example 字符串验证的正则表达式为 /^[0-9a-fA-F\\.\\:////]{2,39}$/
 * 
 * @inner
 * @param {string} rule 规则（暂时无用）
 * @param {string} value 需要验证的字符串
 * @param {function} callback 完成回调
 * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回Ip地址不正确
 */
function checkIPCust(rule, value, callback) {
  var reg = /^[0-9a-fA-F\\.\\:////]{2,39}$/;

  if (!reg.test(value)) {
    callback("Ip地址不正确");
  }else{
    callback();
  }
}

/**
 * 验证非法字符
 * 
 * @example 字符串验证的正则表达式为 /^[A-z0-9\\\s+\\_\\#\\$\\\u4e00-\u9fa5]*$/
 * 
 * @inner
 * @param {string} rule 规则（暂时无用）
 * @param {string} value 需要验证的字符串
 * @param {function} callback 完成回调
 * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回请不要输入非法字符
 */
function validateToNextPassword(rule, value, callback) {
  let message = '请不要输入非法字符'
  let regEx = /^[A-z0-9\\\s+\\_\\#\\$\\\u4e00-\u9fa5]*$/
  if (value && !regEx.test(value)) {
    callback(message)
  } else {
    callback()
  }
}

/**
 * 验证密码强度
 * 
 * @example 字符串验证的正则表达式为 /^\d{1,6}$/
 * 
 * @inner
 * @param {string} rule 规则（暂时无用）
 * @param {string} value 需要验证的字符串
 * @param {function} callback 完成回调
 * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回密码为弱密码！
 */
function checkWeekPassword(rule, value, callback) {
  if (/^\d{1,6}$/.test(value)) {
    callback('密码为弱密码！')
  }else{
    callback()
  }
}

/**
 * 验证手机号码格式
 * 
 * Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
 * @example 字符串验证的正则表达式为 /^(0?1[123456789]\d{9})$/
 *  
 * @inner
 * @param {string} rule 校验规则（暂时无用）
 * @param {string} value 需要验证的字符串
 * @param {function} callback 完成回调
 * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回手机号码格式不正确！
 */
function checkMobile(rule, value, callback) {
  var rexp= /^(0?1[123456789]\d{9})$/
  if (value && !rexp.test(value)) {
    callback('手机号码格式不正确！')
  }else{
    callback()
  }
  // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
}

/**
 * 验证邮箱格式
 * 
 * @example 字符串验证的正则表达式为 /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
 *  
 * @inner
 * @param {string} rule 校验规则（暂时无用）
 * @param {string} value 需要验证的字符串
 * @param {function} callback 完成回调
 * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回邮箱格式不正确！
 */
function checkEmail(rule, value, callback) {
  var rexp = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  if(value && !rexp.test(value)) {
    callback('邮箱格式不正确！')
  }else{
    callback()
  }
}

/**
 * 验证身份证号码格式
 * 
 * @example 字符串验证的正则表达式为 /(^\d{17}(\d|x|X)$)/i
 *  
 * @inner
 * @param {string} rule 校验规则（暂时无用）
 * @param {string} value 需要验证的字符串
 * @param {function} callback 完成回调
 * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回身份证号码格式不正确！
 */
function checkIDCard(rule, value, callback) {
  var rexp= /(^\d{17}(\d|x|X)$)/i
  if (!rexp.test(value)) {
      callback('身份证号码格式不正确！')
  }else{
    callback()
  }
}

/**
 * 验证数字边界
 * 
 * @example [
 *  rangs: [1, 9]
 *  value: 8 -> 通过
 *  value: 11-> 请输入区间值[1, 9]
 * ]
 * 
 * @inner
 * @param {object} rule 校验规则
 * @param {number[]} rule.ranges 边界数组[min, max]
 * @param {number} value 需要验证的值
 * @param {function} callback 完成回调
 * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回请输入区间值[min, max]
 */
function ranges(rule,value,callback) {
  if(rule.ranges instanceof Array && rule.ranges.length===2) {
    if(rule.ranges[0]>value || rule.ranges[1]<value){
       callback(`请输入区间值${JSON.stringify(rule.ranges)}`)
    }else{
      callback()
    }
  }else{
    callback()
  }
}

/**
 * 验证文件尺寸
 * 
 * @example [
 *  rule: { fileSize: 1024 * 1024 }
 *  value: { file: { size: 1024 } } -> 通过
 *  value: { file: { size: 1024 * 1024 * 1024 } }-> 文件大小不超过 1024 * 1024
 * ]
 * @inner
 * @param {object} rule 校验规则
 * @param {number} rule.fileSize 文件尺寸最大值
 * @param {object} value 需要验证的文件对象
 * @param {object} value.file 需要验证的文件对象
 * @param {number} value.file.size 文件尺寸大小
 * @param {function} callback 完成回调
 * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回文件大小不超过fileSize
 */
function fileSize(rule,value,callback) {
  if(value.file && value.file.size>rule.fileSize){
    callback(`文件大小不超过 ${rule.fileSize}`)
  }else{
    callback()
  }
}

/**
 * 验证字符串/数组元素为正整数
 * 
 * Note: 只验证数组的元素和字符串是否为正整数 其他的数据类型暂不校验
 * 
 * @example 字符串验证的正则表达式为 /^([1-9]\d*|[0]{0,1})$/
 * 
 * @inner
 * @param {string} rule 校验规则（暂时无用）
 * @param {string|number[]} value 需要验证的字符串
 * @param {function} callback 完成回调
 * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回必须为正整数！
 */
function integer(rule,value,callback) {
  var rexp=/^([1-9]\d*|[0]{0,1})$/
  if(value instanceof Array){
    for(let i=0;i<value.length;i++){
        if (!rexp.test(value[i])) {
           return callback('必须为正整数！')
        }else{
            return callback()
        }
     }
     return callback()
  }else if(typeof(value) === "string"){
    if (!rexp.test(value)) {
        return callback('必须为正整数！')
    }else{
       return callback()
    }
  }
  return callback()
}

/**
 * 验证长度
 * 
 * Note: 只验证数据类型可以获取.length的有效结果的数据类型，包括字符串和数组
 * 
 * @example [
 *  rule: { value: 5 }
 *  value: '1234' -> 通过
 *  value: [1, 2, 3, 4, 5, 6] ->  不能大于5项
 * ]
 * @inner
 * @param {object} rule 校验规则
 * @param {number} rule.value 最大长度
 * @param {string|number[]} value 需要验证的字符串
 * @param {function} callback 完成回调
 * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回不能大于（最大长度）项
 */
function maxLength(rule,value,callback) {
  if(value && value.length>rule.value){
     callback('不能大于'+rule.value+'项')
  }else{
    callback()
  }
}

/**
 * 验证标签最大长度
 * 
 * Note: 默认最大长度为5，标签以英文逗号分隔
 * 
 * @example [
 *  value: '1,2,3' -> 通过
 *  value:'1,2,3,4,5,6,7,8' ->  备注标签最多5项
 * ]
 * @inner
 * @param {object} rule 校验规则（暂时无用）
 * @param {string} value 需要验证的字符串
 * @param {function} callback 完成回调
 * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回备注标签最多5项
 */
function tagMaxLength(rule,value,callback) {
  if(value && value.split(",").length > 5){
    callback("备注标签最多5项")
  } else {
    callback()
  }
}

/**
 * 验证日期差
 * 
 * Note: value的元素类型需要时moment类型，需要使用moment.diff比较函数,第一个元素日期要小于第二个元素日期
 * 
 * @example [
 *  rule: { days: 5 }
 *  value: [moment('2019-01-01'), moment('2019-01-03')] -> 通过
 *  value：[moment('2019-01-01'), moment('2019-01-13')] -> 日期差不能超过5天
 * ]
 * @inner
 * @param {object} rule 校验规则
 * @param {number} rule.days 日期差（天数）
 * @param {array} value 需要验证的日期 [min, max]
 * @param {function} callback 完成回调
 * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回日期差不能超过(days)天
 */
function dateRangePicked(rule, value, callback) {
  var days = rule.days
  let diffDays = value[1].diff(value[0], "days")
  if (diffDays > days) {
    callback("日期差不能超过" + days + "天")
  } else {
    callback()
  }
}

/**
 * 验证日期差
 * 
 * Note: value的类型是moment类型，需要使用moment.diff比较函数,规则的比较类型不传或者传错，则不比较
 * 
 * @example [
 *   rule: { date: [moment('2019-01-01'), type: 'bigger' }
 *   value: moment('2019-02-01') -> 通过
 *   value：moment('2018-01-01') -> 结束时间必须大于开始时间！
 * ]
 * 
 * @inner
 * @param {object} rule 校验规则
 * @param {object} rule.date 日期(moment日期)
 * @param {string} rule.type 比较类型 bigger|smaller
 * @param {object} value 需要验证的日期(moment日期)
 * @param {function} callback 完成回调
 * @return {string} Desc: 通过校验的字符串返回undefined 未通过返回日期差不能超过(days)天
 */
function dateCompare(rule, value, callback) {
  var date = rule.date
  var type = rule.type
  if (value && date) {
    let diff = value.diff(date)
    if (type === "bigger") {
      if (diff < 0) {
        callback("结束时间必须大于开始时间！")
      }else{
        callback()
      }
    } else if (type == "smaller") {
      if (diff > 0) {
        callback("开始时间必须小于结束时间！")
      }else{
        callback()
      }
    }else{
      callback()
    }
  }else{
    callback()
  }
}

export const rules = {
  validateSpecialCharacters,
  checkIP,
  validatePort,
  checkIPorDomain,
  checkIPCust,
  validateToNextPassword,
  checkWeekPassword,
  checkMobile,
  checkEmail,
  checkIDCard,
  ranges,
  fileSize,
  integer,
  maxLength,
  tagMaxLength,
  dateRangePicked,
  dateCompare
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
}