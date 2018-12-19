
export function getBIZLabel(codeData,value){
    let label = '未知'
    try{
        codeData.forEach(arr => {
            if(arr.value === value){
                label = arr.label
                throw 'Finish and value = ' + label
            }
        });
    } catch (e) {
        console.log(e)
    }
    return label
}
