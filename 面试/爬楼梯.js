/**
 * @param {number} n
 * @return {number}
 */
 var climbStairs = function(n) {
    if(n == 1){
        return 1
    }
    if(n == 2){
        return 2
    }
    let f1 = 1;
    let f2 = 2;
    let m = 2
    if(m!==n){
        let f = f2;
        f2 = f1+f2;
        f1=f
        m++

    }
    return f2
};
climbStairs(4)