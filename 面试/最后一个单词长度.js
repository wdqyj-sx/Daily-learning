/**
 * @param {string} s
 * @return {number}
 */
 var lengthOfLastWord = function(s) {
    let sArr = s.split(' ')
    console.log(sArr)
    return sArr[sArr.length-1].length>0?sArr[sArr.length-1].length:sArr[sArr.length-2].length
};
lengthOfLastWord("   fly me   to   the moon  ")