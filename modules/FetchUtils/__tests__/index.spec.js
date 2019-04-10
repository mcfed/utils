import {fetchDownload,fetchGet,fetchPost,stringifyURL,processBody} from '../index'
import fetchMock from 'fetch-mock'
import { stringify } from 'qs'
// import Headers from 'headers'

jest.autoMockOff();

describe('FetchUtils使用 Get 请求', () => {
  beforeEach(() => {
    // fetch.resetMocks()
  })
  it('fetch Get 请求200 不带参数',(done)=>{
    let mockResult={
      code:0
    }
    let url = "http://localhost/200"
    let options={}
    let mock = fetchMock.mock(url,JSON.stringify(mockResult),options)
    fetchGet(url).then((result)=>{
      expect(result).toEqual(mockResult)
      mock.lastOptions(true, {headers:{}})
      done()
    })
  })
  it('fetch Get 请求500 不带参数',(done)=>{
    let mockResult={
      code:500,
    }
    let url = "http://localhost/500"
    let options={}
     fetchMock.mock(url,500,options)
     fetchGet(url).then((result)=>{
       expect(result.code).toEqual(mockResult.code)
       done()
     })
  })

  it('fetch Get 请求200 带参数 a=1',(done)=>{
    let mockResult={}
    let url = "http://localhost/"
    let options={
      body:{
        a:1
      }
    }
    fetchMock.mock([url,stringify(options.body)].join("?"),JSON.stringify(mockResult),options)
    fetchGet(url,options).then((result)=>{
      expect(result).toEqual(mockResult)
      done()
    })
  })

  it('fetch Get 请求200 带参数 array a=["2018","2019"]',(done)=>{
    let mockResult={}
    let url = "http://localhost/withParam/array"
    let options={
      body:{
        a:["2018","2019"]
      }
    }
    options = processBody(options)
    fetchMock.mock([url,stringify(options.body)].join("?"),JSON.stringify(mockResult),options)
    fetchGet(url,options).then((result)=>{
      expect(result).toEqual(mockResult)
      done()
    })
  })
})
describe.skip('FetchUtils使用 Post 请求', () => {
  it('post 请求200',(done)=>{
    let mockResult={
      code:0
    }
    let url = "http://localhost/post/200"
    let options={
      body:{}
    }
    fetchMock.mock(url,JSON.stringify(mockResult),options)
    fetchPost(url,options).then((result)=>{
      expect(result).toEqual(mockResult)
      done()
    })
  })

  it('post 请求500',(done)=>{
    let mockResult={
      code:500
    }
    let url = "http://localhost/post/500"
    let options={
      body:{}
    }
    fetchMock.mock(url,JSON.stringify(mockResult),options)
    fetchPost(url,options).then((result)=>{
      expect(result).toEqual(mockResult)
      done()
    })
  })
})

describe.skip('FetchUtils使用 fetchDownload 请求', () => {
  it.skip('fetchDownload 请求200',(done)=>{
    let mockResult={
    }
    let url = "http://localhost/download/200"
    let options={
      body:{}
    }
    fetchMock.mock(url,JSON.stringify(mockResult),options)
    fetchDownload(url).then((result)=>{
      expect(result).toEqual(mockResult)
      done()
    })
  })
})

describe.skip('FetchUtils使用 processBody 方法', () => {
  it.skip('processBody',(done)=>{
    done()
  })

  it.skip('processPraramItem 处理参数方法',(done) =>{
    done()
  })
})
