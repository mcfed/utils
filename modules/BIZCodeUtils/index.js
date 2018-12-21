
export function getBIZLabel(codeData,value){
    let label = '未知'
    try{
        codeData.forEach(arr => {
            if(arr.code === value){
                label = arr.message
                throw 'Finish and value = ' + label
            }
        });
    } catch (e) {
        console.log(e)
    }
    return label
}
