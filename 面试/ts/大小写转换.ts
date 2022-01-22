export {}
function reserval(str:string):string{
    let newStr:string = '';
    if(Object.prototype.toString.call(str).slice(8,-1)!=='string'){
        return '请输入字符串'
    }
    for(let i = 0;i<str.length;++i){
        newStr+= (str.charCodeAt(i)>96 && str.substr(i,1).toUpperCase()) || str.substr(i,1).toLowerCase()
    }
    return newStr;
}

console.log(reserval('sxX'))