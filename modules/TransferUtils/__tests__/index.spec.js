import {transferJson} from '../index'
import Ddata from '../data.json'


describe('TransferUtils使用',() => {
    it('transferJson 正常转译',(done) =>{  
        const demoObj = [
            {"人员": "郭荣"}, 
            {"基本信息.年龄": 18}, 
            {"基本信息.性别": "女"}, 
            {"基本信息.英文名": "guorong"}, 
            {"基本信息.名族": "土家族"}, 
            {"工作信息.所在单位": "杭州美创"}, 
            {"工作信息.公司信息.地址": "丰潭路508号"}, 
            {"工作信息.公司信息.地址详情.省": "浙江省"}, 
            {"工作信息.公司信息.地址详情.市": "杭州市"}, 
            {"工作信息.公司信息.地址详情.区": "拱墅区"}, 
            {"工作信息.公司信息.地址详情.街道": "祥符街道"}, 
            {"工作信息.公司信息.电话": "400"}, 
            {"工作信息.公司信息.编码": "310000"}
        ];      
        const result = transferJson(Ddata);
        expect(result).toEqual(demoObj) 
        done()
    })

    it('transferJson 异常转译',(done) =>{  
        const demoObj = [];      
        const result = transferJson(undefined);
        expect(result).toEqual(demoObj) 
        done()
    })
    
})