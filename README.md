# utils

> utils 模块提供工具类包：请求类FetchUtils、字典码类DictUtils、状态码类BIZCodeUtils、权限类AuthUtils等。

## 请求类FetchUtils

>用于统一请求封装类，提供各种标准化接口参数转换

| 参数 | 说明 | 参数类型 | 返回类型 |
| - | :-: | -: | -: |
| fetchGet | get 方法发送请求 | object   | -  |
| fetchList | get 方法发送请求,适用于分页参数转换请求 | object   | -  |
| fetchPost | post方式提交请求参数使用body传递 | object | - |
| fetchPut | put 方式提交请求参数使用body传递 | Object | - |
| fetchDelete | put 方式提交请求参数使用body传递 | Object | - |
| fetchPostForm | post方式提交请求参数使用FormData文件上传 | object | - |
| fetchDownload |  使用GET 方式进行文件下载 | Object | - |
| fetchGraphql |  使用POST 提交graphql | url,option,querys | - |
| fetchGraphqlList |  使用POST 提交graphql | url,option,querys | - |



## 字典码类DictUtils

> 用于统一 ｀字典｀ 数据转换工具，获指定类型字典数据或 转换某一类型名称

| 参数 | 说明 | 参数类型 | 返回类型 |
| - | :-: | -: | -: |
| getDictList | 获取指定类型字典数据 |  type：Object,String | Array  |
| getDictLabel | 获取指定类型值转换名称 | type: Object,String,value:String | String |



## 状态码类 BIZCodeUtils

| 参数 | 说明 | 参数类型 | 返回类型 |
| - | :-: | -: | -: |
| getBIZLabel | 转换BIZCode value -> label | value:int  | String  |





## 权限类AuthUtils

>以下未定义使用

| 参数 | 说明 | 类型 | 默认值 |
| - | :-: | -: | -: |
| options | 传送渲染子节点数据 [] | Array  | -  |


## 用户信息





## json递归转译类 TransferUtils

> 用于将有层级关系的json国际化中英对照的翻译对象转换成react能直接使用的标准化对象

| 参数 | 说明 | 参数类型 | 返回类型 |
| - | :-: | -: | -: |
| data | 需要翻译json对象 |  type：Object | Object  |
