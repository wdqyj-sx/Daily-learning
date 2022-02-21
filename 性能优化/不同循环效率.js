let arr = [1,2,3,4,5]

for(let i = 0;i<arr.length;++i){
    console.log(arr[i])
}

for(let i =0,len = arr.length;i<len;++i){
    console.log(arr[i])
}

arr.forEach(i =>{
    console.log(i)
})

for(let i in arr){
    console.log(arr[i])
}