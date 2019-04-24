export const rules = {
  validateSpecialCharacters : (rule, value, callback) => {
    let message = '请不要输入非法字符'
    let regEx = /^[A-z0-9\\_\\#\\$\\\u4e00-\u9fa5]*$/
    if (value && !regEx.test(value)) {
      callback(message)
    } else {
      callback()
    }
  },

  checkIP: (rule, value, callback) => {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    if (value && !reg.test(value)) {
      callback("IP地址不正确")
    } else {
      // console.log("callback")
      callback()
    }
  },
  // validator
  validatePort: (rule, value, callback) => {
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
  },
  checkIPCust:(rule, value, callback) => {
    var reg = /^[0-9a-fA-F\\.\\:////]{2,39}$/;

    if (!reg.test(value)) {
      callback("Ip地址不正确");
    }else{
      callback();
    }
  },
  //validator
  validateToNextPassword:(rule, value, callback) => {
    let message = '请不要输入非法字符'
    let regEx = /^[A-z0-9\\_\\#\\$\\\u4e00-\u9fa5]*$/
    if (value && !regEx.test(value)) {
      callback(message)
    } else {
      callback()
    }
  },
  checkWeekPassword: (rule, value, callback) =>{
    if (/^\d{1,6}$/.test(value)) {
      callback('密码为弱密码！')
    }else{
      callback()
    }
   },
   /**
    * [checkMobile 手机号码格式]
    * @param  {[type]}   rule     [description]
    * @param  {[type]}   value    [description]
    * @param  {Function} callback [description]
    * @return {[type]}            [description]
    */
   checkMobile: (rule, value, callback) =>{
     var rexp= /^(0?1[123456789]\d{9})$/
     if (value && !rexp.test(value)) {
       callback('手机号码格式不正确！')
     }else{
       callback()
     }
     // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
   },
   checkIDCard: (rule, value, callback) =>{
     var rexp= /(^\d{17}(\d|x|X)$)/i
     if (!rexp.test(value)) {
         callback('身份证号码格式不正确！')
     }else{
       callback()
     }

   },
   ranges:(rule,value,callback)=>{
     if(rule.ranges instanceof Array && rule.ranges.length===2) {
       if(rule.ranges[0]>value || rule.ranges[1]<value){
          callback(`请输入区间值${JSON.stringify(rule.ranges)}`)
       }else{
         callback()
       }
     }else{
       callback()
     }

   },

   fileSize:(rule,value,callback)=>{
     if(value.file && value.file.size>rule.fileSize){
       callback(`文件大小不超过 ${rule.fileSize}`)
     }else{
       callback()
     }
   },
   integer:(rule,value,callback)=>{
     var rexp=/^([1-9]\d*|[0]{0,1})$/
     if(value instanceof Array){
       for(let i=0;i<value.length;i++){
           if (!rexp.test(value[i])) {
              return callback('必须为正整数！')
           }else{
                // callback()
           }
        }
        return callback()
     }else if(typeof(value) == "string"){
       if (!rexp.test(value)) {
           return callback('必须为正整数！')
       }else{
          return callback()
       }
     }
    // return callback()
   },
   maxLength:(rule,value,callback)=>{
     if(value && value.length>rule.value){
        callback('不能大于'+rule.value+'项')
     }else{
       callback()
     }
   },
   tagMaxLength:(rule,value,callback)=>{
     if(value && value.split(",").length > 5){
       callback("备注标签最多5项")
     }else{
       callback()
     }
   },
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
  dateRangePicked: (rule, value, callback) => {
    var days = rule.days
    let diffDays = value[1].diff(value[0], "days")
    if (diffDays > days) {
      callback("日期差不能超过" + days + "天")
    } else {
      callback()
    }
  },
  dateCompare: (rule, value, callback) => {
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
}
