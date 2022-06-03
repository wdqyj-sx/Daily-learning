let code16 = Buffer.from("无敌且英俊")
//将16进制转为2进制
//获取2进制字符串
let code2 = ''
for(let i = 0;i<code16.length;++i){
    code2+=code16[i].toString(2)
}

// 分别按6位开始截取,并转换成10进制
let code10 = []
let i = 6;
while(i<=code2.length){
   code10.push(parseInt(code2.substring(i-6,i),2))
    i+=6
}
// 制作64编码，一共64个字符
let code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
code += code.toLowerCase();
code += '0123456789'
code += '+/'

let base64 = ""
//输出字符对应的编码
for(let i = 0;i<code10.length;++i){
    base64+=code[code10[i]]
}
console.log(base64)


