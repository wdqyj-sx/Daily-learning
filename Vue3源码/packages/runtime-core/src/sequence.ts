export function getSequence(arr) {
    let len = arr.length
    let result = [0]
    let p = new Array(len).fill(0)
    let lastIndex, start, end,middle;
    for (let i = 0; i < len; i++) {
        let arrI = arr[i]
        if (arrI !== 0) {
            lastIndex = result[result.length - 1]
            if (arr[lastIndex] < arrI) {
                result.push(i)
                p[i] = lastIndex
            } else {
                start = 0
                end = result.length - 1
                while(start < end){
                    middle = Math.floor((start+end)/2)
                    if(arr[result[middle]] <arrI){
                        start = middle+1
                    }else {
                        end = middle
                    }
                }
                if(arr[result[end]]>arrI){
                    p[i] = result[end-1]
                    result[end] = i
                }
           }
        }
    }
     //倒叙追溯，先取到结果中的最后一个
     let i = result.length
     let last = result[i-1]
     while(i-->0){
         result[i] = last
         last = p[last]
     }
     return result
}

