const ponyfill = require('fetch-ponyfill')
ponyfill()
global.fetch = require('node-fetch')

const nodeFetch = jest.requireActual('node-fetch');
const fetchMock = require('fetch-mock').sandbox();
Object.assign(fetchMock.config, nodeFetch, {
  fetch: nodeFetch
});
global.Headers = ()=>{}
module.exports = fetchMock;
