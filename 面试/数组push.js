/**
 * @param {number} numRows
 * @return {number[][]}
 */
 var generate = function(numRows) {
    let ans = []
    ans.push([1])
    ans.push([1,1])
    if(numRows <= 0){
        return []
    }
    if(numRows == 1){
        return [ans[0]]
    }
    if(numRows == 2){
        return ans 
    }
    for(let i = 3 ;i<=numRows;++i){
        let rowArr = []
        rowArr[0] = 1
        rowArr[i-1] = 1
        let lastArr = ans[i-2]
        for(let j = 1;j<lastArr.length;++j){
            let sum = lastArr[j]+lastArr[j-1]
            rowArr[j] = sum
        }
        ans.push(rowArr)
    }
    return ans
};
console.log(generate(5))