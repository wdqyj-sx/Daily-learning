
function createArr (arr, index) {
    if (index >= 5) {
        return arr
    }
    // 获取2-32之间随机数
    let value = Math.round(Math.random() * 30 + 2);
    //遍历数组
    let i = 0;
    while (arr.indexOf(value) > -1) {
        value = Math.round(Math.random() * 30 + 2);
    }
    arr[index++] = value;
    return createArr(arr, index)

}

console.log(createArr([], 0))