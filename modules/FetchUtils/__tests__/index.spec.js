import {fetchGet} from '../index'

jest.autoMockOff();

describe('FetchUtils使用', () => {
  beforeEach(() => {
    fetch.resetMocks()
  })
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
    let url = "http://localhost/talentInfo/listPageJson"
     fetch.mockResponse(JSON.stringify(mockResult))
     fetchGet(url).then((result)=>{
       expect(result).toEqual(mockResult.data)
       done()
     })
  })

  it.skip('fetch Get 异常请求',(done)=>{
    let mockResult={
      code:10,
      data:{
        list:[]
      }
    }
    let url = "http://localhost/talentInfo/listPageJson"
     fetch.mockResponse(JSON.stringify(mockResult))
     fetchGet(url).then((result)=>{
       expect(result).toEqual(mockResult.code)
       done()
     })
  })

  it.skip('fetchDownload 正常下载',(done)=>{
    done()
  })

  it.skip('fetchDownload 异常下载',(done)=>{
    done()
  })

})
