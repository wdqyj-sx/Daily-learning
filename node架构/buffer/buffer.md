### node中的buffer模块
#### base64转换规则
> base64可以编码任何东西，其基于二进制，方便传输，我们可以尝试编译一段文字
* 输入无敌且英俊
* node中汉字占3个字节，一个字节有8位，我们需要将函子转为二进制，只需要利用BUffer转为16进制再转为2进制即可
* 可以判断，五个汉字转为二进制一共120位
* 由于base64规定，每个字节不能超过64，我们可以推测出，一个字节8位的话有2**8 = 256，所以我们要重新分配每个字节的内容，使之不能超过64
  * 由  15*8 -> 20 * 6
  * 如： 11100111  10001111  10100000  ->  111001  111000  111110   100000
* 然后将每一个字节转为10进制存储
* 根据转化的十进制数查找字节码
* 字节码为"A-Z"+"a-z"+"0-9"+"+/",刚好64位
* 查找出来的字节码拼接的字符串即为64编码
```js
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

```
> 我们可以将得出的64编码通过解码，得出我们的内容：无敌且英俊