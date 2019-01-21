import {transferJson,transferJsonContainsID} from '../index'
import Ddata from '../data.json'
import IDdata from '../idData.json'


describe.skip('TransferUtils使用',() => {
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

    it('transferJsonContainsID 正常转译',(done)=>{
        const demoObj = {
            "人员":{"id":"人员","defaultMessage":"郭荣"},
            "基本信息.年龄":{"id":"基本信息.年龄","defaultMessage":18},
            "基本信息.性别":{"id":"基本信息.性别","defaultMessage":"女"},
            "基本信息.英文名":{"id":"基本信息.英文名","defaultMessage":"guorong"},
            "基本信息.名族": {"id":"基本信息.名族","defaultMessage":"土家族"},
            "工作信息.所在单位":{"id":"工作信息.所在单位","defaultMessage":"杭州美创"},
            "工作信息.公司信息.地址":{"id":"工作信息.公司信息.地址","defaultMessage":"丰潭路508号"},
            "工作信息.公司信息.地址详情.省":{"id":"工作信息.公司信息.地址详情.省","defaultMessage":"浙江省"},
            "工作信息.公司信息.地址详情.市":{"id":"工作信息.公司信息.地址详情.市","defaultMessage":"杭州市"},
            "工作信息.公司信息.地址详情.区":{"id":"工作信息.公司信息.地址详情.区","defaultMessage":"拱墅区"},
            "工作信息.公司信息.地址详情.街道":{"id":"工作信息.公司信息.地址详情.街道","defaultMessage":"祥符街道"},
            "工作信息.公司信息.电话":{"id":"工作信息.公司信息.电话","defaultMessage":"400"},
            "工作信息.公司信息.编码":{"id":"工作信息.公司信息.编码","defaultMessage":"310000"}
        };
        const result = transferJsonContainsID(IDdata);
        expect(result).toEqual(demoObj)
        done()
    })

    it('transferJsonContainsID undefined 异常转译',(done) =>{
        const demoObj = {};
        const result = transferJsonContainsID(undefined);
        expect(result).toEqual(demoObj)
        done()
    })

    it('transferJsonContainsID null 异常转译',(done) =>{
        const demoObj = {};
        const result = transferJsonContainsID(null);
        expect(result).toEqual(demoObj)
        done()
    })

    it('transferJsonContainsID 内容 null 异常转译',(done) =>{
        const dataTemp ={"id":2,"人员":null}
        const demoObj = {};
        const result = transferJsonContainsID(dataTemp);
        expect(result).toEqual(demoObj)
        done()
    })

})
