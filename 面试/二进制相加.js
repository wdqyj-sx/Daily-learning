// /**
//  * @param {string} a
//  * @param {string} b
//  * @return {string}
//  */
//  var addBinary = function(a, b) {
//     let i = 0,j = 0;
//     let suma = 0,sumb = 0;
//     while(a.length-1-i>=0){
//         suma+=parseInt(a[a.length-1-i])*Math.pow(2,i)
//         ++i
//     }
//      while(b.length-1-j>=0){
//         sumb+=parseInt(b[b.length-1-j])*Math.pow(2,j)
//         ++j
//     }
//     console.log(suma)
//     console.log(sumb)
//     let sumc = suma+sumb
//     let c = []
//     console.log(sumc)
//     while(sumc!=0){
//         c.unshift(sumc%2)
//         sumc =parseInt(sumc/2)
       
//     }
//     return c.join('')
// };
// console.log(addBinary('11','1'))
/**
 * @param {string} a
 * @param {string} b
 * @return {string}
 */
 var addBinary = function(a, b) {
    let sumc = []
    let i = a.length-1;
    let j = b.length-1;
    sum = 0
    let flag = false
    while(i>=0||j>=0){
        sum = 0
        let x = a[i]
        let y = b[j]
        if(i <0){
            x = 0
        }
        if(j<0){
            y = 0
        }
        if(flag){
            sum = parseInt(x)+parseInt(y)+1
        }else{
            sum = parseInt(x)+parseInt(y)
        }
        if(sum >=2){
            sum = sum%2
            flag = true
        }
        else {
            flag =false
        }
        sumc.unshift(parseInt(sum))
        --i
        --j
    }
    if(flag)
    sumc.unshift(1)
    console.log(sumc.join(''))
};

addBinary('11','1')