var reverseWords = function(s) {
    let arr = s.split(" ")
    let newArr = arr.map(word => word.split('').reverse().join(''))
    return newArr.join(" ")
}
console.log(reverseWords("Let's take LeetCode contest"))