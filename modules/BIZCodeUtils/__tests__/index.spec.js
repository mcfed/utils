import {getBIZLabel} from '../index'

describe('BIZCodeUtils',()=>{
   
    it('getBIZLabel 正常获取',(done) =>{
        const demoLabel = '操作成功'
        const result = getBIZLabel(1)
        expect(result).toEqual(demoLabel)
        done()
    })

    it('getBIZLabel 异常获取',(done) =>{
        const demoLabel = '未知'
        const result = getBIZLabel(999)
        expect(result).toEqual(demoLabel)
        done()
    })
})