import {getBIZLabel} from '../index'

describe('BIZCodeUtils',()=>{

    it('getBIZLabel 正常获取',(done) =>{
        var codeData=[{
          code:1,
          message:"操作成功"
        }]
        const demoLabel = '操作成功'
        const result = getBIZLabel(codeData,1)
        expect(result).toEqual(demoLabel)
        done()
    })

    it('getBIZLabel 异常获取',(done) =>{
        const demoLabel = '未知'
        var codeData=[{
          code:1,
          message:"操作成功"
        }]
        const result = getBIZLabel(codeData,999)
        expect(result).toEqual(demoLabel)
        done()
    })
})
