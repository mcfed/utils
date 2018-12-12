import MockFetch from 'mock-fetch-api'
import {fetchGet} from '../index'

describe('FetchUtils使用', () => {

  it.skip('fetch Get 正常请求',()=>{
    let url = "http://192.168.200.178:3000/mock/60/db-audit/svc_search_biz/backup/task/record"
     fetchGet(url).then((result)=>{
       //console.dir(result)
     })
  })

  it.skip('fetch Get 正常请求',(done)=>{
    let mockResult={
      code:0,
      data:{
        list:[]
      }
    }
    let url = "http://www.test.com/talentInfo/listPageJson"
    MockFetch.when('GET', url).respondWith(200, {code:0,data:{list:[]}});
     fetchGet(url).then((result)=>{
       expect(result).toEqual(mockResult.data)
       done()
     })
  })

})
