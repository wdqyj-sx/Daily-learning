/**
 * @param {string} s
 * @return {boolean}
 */
 var isPalindrome = function(s) {
    let len = s.length
    if(len == 0){
        return true
    }
    let arr = []
    let re = /[0-9a-zA-Z]/;
    while(--len >=0){
        console.log(re.test(s[len]))
        if(re.test(s[len]))
            {
              arr.push( s[len].toLocaleLowerCase())

            }      
         
    }
    console.log(arr)
    let flag = true
    for(let i = 0,j=arr.length-1;i<=j;++i,--j){
        if(arr[i] !== arr[j]){
            flag = false
        }
    }
    return flag
    
};

isPalindrome("A man, a plan, a canal: Panama")