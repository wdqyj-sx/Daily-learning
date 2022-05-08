// Problem: ```js
给定一个字符串 s ，找到 它的第一个不重复的字符，并返回它的索引 。如果不存在，则返回 -1 。


示例 1：
输入: s = "leetcode"
输出: 0


示例 2:
输入: s = "loveleetcode"
输出: 2


示例 3:
输入: s = "aabb"
输出: -1


```
// @interview start

```js
var firstUniqChar = function(s) {
    // TODO
    const m = new Map()
    for(let i = 0;i<s.length;++i){
        if(!m.has(s[i])){
            m.set(s[i],1)
        }else {
            m.set(s[i],m.get(s[i])++)
        }
    }
    [...m.values].forEach((item,index)=>{
        if(item == 1){
            return index
        }
    })
    return -1
};
```
// @interview end
