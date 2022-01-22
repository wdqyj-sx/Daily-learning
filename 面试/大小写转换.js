function reserval(str) {
    var newStr='';
    console.log()
    if (Object.prototype.toString.call(str).slice(8, -1) !== 'String') {
        return '请输入字符串';
    }
    for (var i = 0; i < str.length; ++i) {
        newStr += (str.charCodeAt(i) > 96 && str.substr(i, 1).toUpperCase()) || str.substr(i, 1).toLowerCase();
    }
    return newStr;
}
console.log(reserval('sxX'));
