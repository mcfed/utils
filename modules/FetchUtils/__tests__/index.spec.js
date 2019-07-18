import {
  fetchDownload,
  fetchGet,
  fetchList,
  fetchPost,
  fetchCatch,
  fetchGraphql,
  fetchGraphqlList,
  fetchGraphqlAsResult,
  stringifyURL,
  processPraramItem,
  processGraphqlParams,
  processBody
} from "../index";
// import { ServerResponse as Response } from "http";

import fetchMock from "fetch-mock";
import { stringify } from "qs";
// import Headers from 'headers'
const ponyfill = require("fetch-ponyfill")();
fetchMock.config = Object.assign(fetchMock.config, {
  Headers: ponyfill.Headers,
  Request: ponyfill.Request,
  Response: ponyfill.Response,
  fetch: ponyfill
});

const Response = ponyfill.Response;
jest.autoMockOff();

describe("FetchUtils使用 Get 请求", () => {
  beforeEach(() => {
    // fetch.resetMocks()
  });
  it("fetch Get 请求200 不带参数", done => {
    let mockResult = {
      code: 0
    };
    let url = "http://localhost/200";
    let options = {};
    let mock = fetchMock.mock(url, JSON.stringify(mockResult), options);
    fetchGet(url).then(result => {
      expect(result).toEqual(mockResult);
      mock.lastOptions(true, { headers: {} });
      done();
    });
  });
  it("fetch Get 请求500 不带参数", done => {
    let mockResult = {
      code: 500
    };
    let url = "http://localhost/500";
    let options = {};
    fetchMock.mock(url, 500, options);
    fetchGet(url).then(result => {
      expect(result.code).toEqual(mockResult.code);
      done();
    });
  });

  it("fetch Get 请求200 带参数 a=1", done => {
    let mockResult = {};
    let url = "http://localhost/";
    let options = {
      body: {
        a: 1
      }
    };
    fetchMock.mock(
      [url, stringify(options.body)].join("?"),
      JSON.stringify(mockResult),
      options
    );
    fetchGet(url, options).then(result => {
      expect(result).toEqual(mockResult);
      done();
    });
  });
  it("fetch Get 请求200 url带参数 a=1 body b:1", done => {
    let mockResult = {};
    let url = "http://localhost/?a=1";
    let options = {
      body: {
        b: 1
      }
    };
    fetchMock.mock(
      [url, stringify(options.body)].join("&"),
      JSON.stringify(mockResult),
      options
    );
    fetchGet(url, options).then(result => {
      expect(result).toEqual(mockResult);
      done();
    });
  });

  it('fetch Get 请求200 带参数 array a=["2018","2019"]', done => {
    let mockResult = {};
    let url = "http://localhost/withParam/array";
    let options = {
      body: {
        a: ["2018", "2019"]
      }
    };
    options = processBody(options);
    fetchMock.mock(
      [url, stringify(options.body)].join("?"),
      JSON.stringify(mockResult),
      options
    );
    fetchGet(url, options).then(result => {
      expect(result).toEqual(mockResult);
      done();
    });
  });
  it("fetchList 请求200", done => {
    const mockResult = {
      code: 0,
      data: {
        item: []
      }
    };
    let url = "http://localhost/fetchList/200";
    fetchMock.mock(url, JSON.stringify(mockResult));
    fetchList(url).then(result => {
      expect(result).toEqual(mockResult);
      done();
    });
  });
});

describe("FetchUtils使用 upload 请求", () => {

  it("upload 请求200", (done) => {
    let mockResult = {
      code: 0
    };
    let url = "http://localhost/upload/200";
    let options = {
      body: {}
    };
    fetchMock.mock(url, JSON.stringify(mockResult), options);
    fetchPost(url, options).then(result => {
      expect(result).toEqual(mockResult);
      done();
    });
  });

  it("upload 请求500", done => {
    let mockResult = {
      code: 500
    };
    let url = "http://localhost/upload/500";
    let options = {
      body: {}
    };
    fetchMock.mock(url, JSON.stringify(mockResult), options);
    fetchPost(url, options).then(result => {
      expect(result).toEqual(mockResult);
      done();
    });
  });
});
describe("FetchUtils使用 Post 请求", () => {
  it("post 请求200", done => {
    let mockResult = {
      code: 0
    };
    let url = "http://localhost/post/200";
    let options = {
      body: {}
    };
    fetchMock.mock(url, JSON.stringify(mockResult), options);
    fetchPost(url, options).then(result => {
      expect(result).toEqual(mockResult);
      done();
    });
  });

  it("post 请求500", done => {
    let mockResult = {
      code: 500
    };
    let url = "http://localhost/post/500";
    let options = {
      body: {}
    };
    fetchMock.mock(url, JSON.stringify(mockResult), options);
    fetchPost(url, options).then(result => {
      expect(result).toEqual(mockResult);
      done();
    });
  });

  it("fetch aborted throw error ", done => {
    let mockResult = {
      code: -1,
      message: "request aborted"
    };
    let url = "http://localhost/post/500/throw";
    let options = {
      body: {}
    };
    fetchMock.config.fallbackToNetwork = false;
    fetchMock.mock(
      url,
      new Response({ throws: new TypeError("Failed to fetch") }),
      options
    );
    fetchPost(url, options).then(result => {
      expect(result).toEqual(mockResult);
      done();
    });
  });
});

describe.skip("FetchUtils使用 fetchDownload 请求", () => {
  it.skip("fetchDownload 请求200", done => {
    let mockResult = {};
    let url = "http://localhost/download/200";
    let options = {
      body: {}
    };
    fetchMock.mock(url, JSON.stringify(mockResult), options);
    fetchDownload(url).then(result => {
      expect(result).toEqual(mockResult);
      done();
    });
  });
});

describe("FetchUtils使用 fetchGraphql请求", () => {
  it("fetchGraphql请求200", done => {
    let mockResult = {
      data: {
        a: 1
      }
    };
    let url = "http://localhost/graphql";
    let options = {
      body: {}
    };
    fetchMock.mock(url, JSON.stringify(mockResult), options);
    fetchGraphql(url).then(result => {
      expect(result).toEqual(mockResult);
      done();
    });
  });

  it("fetchGraphqlList请求200", done => {
    let mockResult = {
      data: {
        result: {
          a: 1
        }
      }
    };
    let url = "http://localhost/graphql/graphqlList";
    let options = {
      body: {}
    };
    fetchMock.mock(url, JSON.stringify(mockResult), options);
    fetchGraphqlList(url, options).then(result => {
      expect(result).toEqual(mockResult.data.result);
      done();
    });
  });

  it("fetchGraphqlAsResult请求200", done => {
    let mockResult = {
      data: {
        result: {
          a: 1
        }
      }
    };
    let url = "http://localhost/graphql/graphqlListAsResult";
    let options = {
      body: {}
    };
    fetchMock.mock(url, JSON.stringify(mockResult), options);
    fetchGraphqlAsResult(url).then(result => {
      expect(result).toEqual(mockResult.data.result);
      done();
    });
  });
});

describe("stringifyURL 方法", () => {
  it("是否可以将对应url中的变量替换", () => {
    const url = "http://localhost/:id";
    const options = {
      id: 123
    };
    const result = "http://localhost/123";

    expect(stringifyURL(url, options)).toBe(result);
  });

  it.skip("如果变量不同则不替换", () => {
    const url = "http://localhost/:id";
    const options = {
      member: 213
    };

    expect(stringifyURL(url, options)).toBe(url);
  });

  it("替换值为0的时候，不报错", () => {
    const url = "http://localhost/:id";

    const options = {
      id:0
    }
    const result = "http://localhost/0";

    expect(stringifyURL(url,options)).toBe(result);

  });

  it("替换值为null 时，转换为字符串null ", () => {
    const url = "http://localhost/:id";

    const options = {
      id:null
    }
    const result = "http://localhost/null";

    expect(stringifyURL(url,options)).toBe(result);
  });
});

// describe("", () => {
//
// });

describe("FetchUtils使用 processBody 方法", () => {
  it("processBody", done => {
    const options = {
      body: {
        aa: 123,
        bb: 456
      }
    };
    const result = {
      body: Object.assign({}, options.body, {
        currentPage: undefined,
        totalCount: undefined,
        pageSize: undefined
      })
    };
    expect(result).toEqual(processBody(options));
    done();
  });

  it("processPraramItem 如果正常传入值没有空和数组则不转化", () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3
    };
    expect(processPraramItem(obj)).toEqual(obj);
  });

  it("processPraramItem 如果对象值为空则转为undefined", () => {
    const obj = {
      a: ""
    };

    expect(processPraramItem(obj).a).toBe(undefined);
  });

  it("processPraramItem 如果值为数组则转为字符串", () => {
    const obj = {
      a: [1, 2, 3]
    };

    expect(processPraramItem(obj).a).toBe(JSON.stringify([1, 2, 3]));
  });

  it("processPraramItem 如果值为json则不处理", () => {
    const obj = {
      a: {
        b: 1
      }
    };
    const result = {
      b: 1
    };
    expect(processPraramItem(obj).a).toEqual(result);
  });

  it("processGraphqlParams undefined", () => {
    let result = {
      start: 0,
      end: 9
    };
    expect(processGraphqlParams(undefined)).toEqual(result);
  });

  it("processGraphqlParams {current:1,pageSize:10}", () => {
    let params = { current: 1, pageSize: 10 };
    let result = { start: 0, end: 9 };
    expect(processGraphqlParams(params)).toEqual(result);
  });

  it("processGraphqlParams {order:'descend',columnKey:'aa'} 别名转换 ", () => {
    let params = { order: "descend", columnKey: "aa" };
    let result = { order: "desc", orderBy: "aa", start: 0, end: 9 };
    expect(processGraphqlParams(params)).toEqual(result);
  });
  it("processGraphqlParams {order:'descend',columnKey:'aa'} 非别名不转换 ", () => {
    let params = { order: "descend", columnKey: "aa", name: "11" };
    let result = { order: "desc", orderBy: "aa", name: "11", start: 0, end: 9 };
    expect(processGraphqlParams(params)).toEqual(result);
  });
});
