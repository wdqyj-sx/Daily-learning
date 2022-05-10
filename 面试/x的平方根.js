/**
 * @param {number} x
 * @return {number}
 */
 var mySqrt = function(x) {
    if(x == 0){
        return x
    }
   let l = 0,r = x,ans = -1
   while(l<=r){
       let mind = parseInt((l+r)/2)
       if(mind*mind<x){
           ans = mind
           l = mind+1
       }else if(mind*mind>x){
           r = mind-1
       }else 
            return mind
   }
   return ans
   
};
console.log(mySqrt(1))