/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
 var strStr = function(haystack, needle) {
    if(needle.length == 0){
        return 0
    }
    let slow = 0;
    let fast = 0;
    while(slow< haystack.length && fast<needle.length){
        if(haystack[slow] == needle[fast]){
            slow++
            fast++
        }
        else {
             slow = slow-fast+1
             fast = 0
        }
    }
    console.log(fast)
        console.log(slow)
    if(fast == needle.length){
       
        return slow - fast
    }
    return -1
};
// strStr("mississippi","issip")
while(-1){
    console.log('sx')
}