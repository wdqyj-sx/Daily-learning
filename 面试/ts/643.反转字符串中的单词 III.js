// Problem: 
```js
给定一个字符串 s ，你需要反转字符串中每个单词的字符顺序，同时仍保留空格和单词的初始顺序。


示例 1：
输入：s = "Let's take LeetCode contest"
输出："s'teL ekat edoCteeL tsetnoc"


示例 2:
输入： s = "God Ding"
输出："doG gniD"

var reverseWords = function (s) {
    // TODO
};```
// @interview start
```js
var reverseWords = function(s) {
    let arr = s.split(" ")
    let newArr = arr.map(word => word.split('').reverse().join(''))
    return newArr.join(" ")
}
console.log(reverseWords("Let's take LeetCode contest"))
```
// @interview end
