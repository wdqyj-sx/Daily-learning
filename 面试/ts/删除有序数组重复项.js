/**
 * @param {number[]} nums
 * @return {number}
 */
 var removeDuplicates = function(nums) {
    let len = nums.length
    if(len == 0){
        return len ;
    }
    let fast = 1;
    let flow = 1;
    console.log(fast)
    console.log(len)
    while(fast<len){
        if(nums[fast]>nums[fast-1]){
            nums[flow] = nums[fast]
            flow++
            console.log(flow)
            console.log('sx')
        }
        console.log('sx')
        fast++
    }
    
    return flow
};

removeDuplicates([1,1,2])