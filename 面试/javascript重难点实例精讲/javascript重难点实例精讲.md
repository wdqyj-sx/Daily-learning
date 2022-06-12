# javascript重难点实例精讲
## javascript重点概念
### javascript基本数据类型
#### javascript数据类型 
  * 基本数据类型
    * Undefined
    * Null
    * Boolean
    * Number
    * String
    * Symbol(es6新增)
  * 引用数据类型
    * Obeject
    * Function
    * Array
    * Date
  * Undefined场景
  > Undefined只有一个字面值——Undefined，表示变量不存在
    * 使用声明但未初始化的变量
    ```js
    let a
    console.log(a) 
    ```
    * 获取某个对象不存在的属性
    ```js
    let obj = {
        name:'sx'
    }
    console.log(obj.age) 
    ```
    * 函数多余形参
    ```js
    function add(a,b,c){
        console.log(c)
    }
    add(1,2) 
    ```
    * 函数没有明确返回值
    ```js
    function add(a,b,c){
        console.log(c)
    }
    console.log(add(1,2,3)) 
    ```
  * Null场景
  > Null只有一个字面值null,表示空指针对象，typeof检测为object
    * 声明的变量如果为了保存后面的某个值，最好声明的时候将其赋值为null
    * 获取dom元素时，没有获取到指定对象
    ```js
    document.getElementById("sx")
    ```
    * 正则没有捕获到结果
    ```js
    'text'.match(/a/)
    ```
  * undefined和null的异同
    * 相同点
      * 两者都只有一个字面值，分别为undefined和null
      * 转化为boolean值时，都为false
      * undefined == null,这是因为undefined实际派生自null
    * 不同点
      * null为js关键字，而undefined是js全变量
      * typeof可以检测结果不同
      ```js
      console.log(typeof undefined) //undefined
      console.log(typeof null)  //object
      ```
      * 通过call调用toString()函数返回结果不同
      ```js
        console.log(Object.prototype.toString.call(undefined))  //[object Undefined]
        console.log(Object.prototype.toString.call(null))   // [object Null] 
      ```
      * 字符串类型转换时会转换成各自字面量
      ```js
      console.log(undefined+'sx') //undefinedsx
      console.log(null+'sx')  // nullsx 
      ```
      * 数值类型转换时,undefined会转换为NaN,而null会转换为0
      ```js
      console.log(undefined + 0)  //NaN
      console.log(null + 0)   //0 
      ```
  * Boolean类型
    * js中任何类型都可以转换成boolean类型，其只有true和false两种字面量且区分大小写
    * 不同类型对Boolean的转换
      * String
        * ""和''会被转换成false
        * 其他任何字符串会被转换成true 
        ```js
        console.log(Boolean('0')) //true
        console.log(Boolean(' ')) //true
        ```
      * Number
        * 0和NaN为false
        * 其余为true
        ```js
        console.log(Boolean(NaN)) //false
        console.log(Boolean(0)) //false
        console.log(Boolean(-1)) //true
        ```
      * Object 
        * 只有null转换为false
        * 其余皆为true
        ```js
        console.log(Boolean(null))  //true
        console.log(Boolean({}))  //false 
        ```
      * Function
        * Function类型皆为true
#### Number类型
* 其它类型转Number
  * Boolean
    * true:1
    * false:0
  * Null
    * 0
  * Undefined：
    * Null
  * String 
    * 将数字字面量转换成十进制（前面有0则省略）
    * 空字符串转换为0
    * 其它字符串转换为NaN
    ```js
    console.log(Number('0123')) //123
    console.log(Number('0x3f')) // 63
    console.log(Number('')) //0
    console.log(Number('1fv')) //NaN
    ```