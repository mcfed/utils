/**
 * @module DictUtils
 */

 /**
  * 获取字典列表
  * 
  * @example [
  *   dictData: {'key': [1, 2], 'key2': [3, 4]}
  *   dicName: 'key' -> [1, 2]
  *   dicName: 'key3' -> []
  * ]
  * 
  * @param {object} dictData 字典数据
  * @param {string} dicName 属性名称
  * @return {array} Desc: 返回字典列表
  */
export function getDictList(dictData, dicName) {
  // console.log(dictData)
  return dictData[dicName] || []
}

/**
 * 获取字典的摸狗属性的标签
 * 
 * Note: 要求字典数据的结构严格按照{ [dicName]: [{ label, value }] }
 * 
 * @example [
 *   dictData: {'key': [{ label: 'label1', value: 1, label: 'label2', value: 2 }], 'key2': []}
 *   dicName: 'key'
 *   value: 1 -> 'label1'
 *   value: 3 -> ''
 * ]
 * 
 * @param {object} dictData 字典数据
 * @param {string} dicName 属性名称
 * @param {string} value 值
 * @return {string} Desc: 返回标签
 */
export function getDictLabel(dictData, dicName, value) {
  let label = ''
  try {
    const map = getDictList(dictData, dicName);
    map.forEach(arr => {
      if (arr.value === value) {
        label = arr.label
        // throw 'Finish and value = ' + label 
      }
    });
  } catch (e) {
    console.log(e)
  }
  // console.log(label)
  return label
}