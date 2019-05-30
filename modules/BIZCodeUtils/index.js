/**
 * @module BIZCodeUtils
 */
 
/**
 * 获取业务码的标签
 * 
 * @example [
 *  codeData: { code: 1, message: 'success' }
 *  value: 1 -> 'success'
 *  value: 2 -> '未知'
 * ]
 * 
 * @param {object} codeData 业务码数据 
 * @param {string|number} value 业务码
 * @return {string} Desc: 返回标签
 */
export function getBIZLabel(codeData, value) {
  let label = '未知'
  try {
    codeData.forEach(arr => {
      if (arr.code === value) {
        label = arr.message
        //throw 'Finish and value = ' + label
      }
    });
  } catch (e) {
    console.log(e)
  }
  return label
}