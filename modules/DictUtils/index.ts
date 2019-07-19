

export default abstract class DictUtils{

  static getDictList(dictData:Object, dictName:String) :Array<String> {
    // console.log(dictData)
    // @ts-ignore
    return dictData[dictName] || []
  }

  static getDictLabel(dictData:Object, dictName:String, value:any) :String {
    let label:String = ''
      const map:Array<String> = this.getDictList(dictData, dictName);
      map.forEach((arr:any) => {
        if (arr.value === value) {
          label = arr.label
        }
      });
    return label
  }
}
