import dictData from './dictData.json'

export function getDictList(dicName){
    // console.log(dictData)
    return dictData[dicName] || []
}

export function getDictLabel(dicName,value){
    let label = ''
    try{        
        const map = getDictList(dicName);
        map.forEach(arr => {
            if(arr.value === value){
                label = arr.label
                throw 'Finish and value = ' + label 
            }
        });
    } catch (e) {
        console.log(e)
    }
    // console.log(label)
    return label
}