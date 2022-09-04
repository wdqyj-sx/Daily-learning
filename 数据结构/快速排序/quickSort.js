function quickSort(nums,start,end){
    if(start>end) return 
    let i = start,j = end,base=nums[start]
    while(i<j){
        while(i<j && nums[j]>=base) j--
        while(i<j && nums[i]<=base) i++
        if(i<j){
            swap(nums,i,j)
        } 
    }
    swap(nums,start,i)
    quickSort(nums,0,j-1)
    quickSort(nums,j+1,end)

}
function swap(nums,left,right){
    let temp = nums[left]
    nums[left] =  nums[right]
    nums[right] = temp
}
let nums=[11,24,5,32,50,34,54,76]
quickSort(nums,0,nums.length-1)
console.log(nums)