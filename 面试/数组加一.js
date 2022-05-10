/**
 * @param {number[]} digits
 * @return {number[]}
 */
 var plusOne = function(digits) {
    let num = []
    let num2 = []
    let flag = true
    for(let i = digits.length-1;i>=0;--i){
        if(flag){
            let sum = digits[i]+1
            if(sum == 10){
                sum = 0
                 num.push(sum)
            }else{
                num.push(sum)
                flag = false
            }
        }
        else {
            num.push(digits[i])
        }
    }
    if(num[num.length - 1] == 0){
        num.push(1)
    }
    
     for(let i = num.length-1;i>=0;--i){
         num2.push(num[i])
     }
    return num2
 };
 console.log(plusOne([1,2,4]))