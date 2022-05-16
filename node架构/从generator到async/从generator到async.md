### 从generator到async
#### 迭代器
* 什么叫类数组
  * 有索引
  * 有长度
  * 能遍历
  ```js
    let likeArray = {
        0:0,
        1:1,
        2:2,
        3:3,
        length:4
    }

    let arr = [...likeArray]//报错
  ```
  > * 上述并不是类数组，因为无法进行解构，说明迭代不了
  > * 数组能遍历，是因为内部有迭代的方法，通过Symblo可以给上述类型设置迭代方法,使之成为类数组
  ```js
    const { values } = require("lodash")

    let likeArray = {
        0:0,
        1:1,
        2:2,
        3:3,
        length:4,
        get [Symbol.toStringTag](){
            return 'MyArray'
        },
        [Symbol.iterator]:function(){
            let index = 0
            return {
                next:()=>{
                    return {
                        value:this[index],done:index++==this.length
                    } 
                }
            }
        }
    }

    let arr = [...likeArray] //不报错
    console.log(arr)
    console.log(likeArray.toString())
  ```
* 生成器函数
  * 可以看到，类数组只需要有迭代器就可以遍历，而迭代器需要我们手动实现，有一个函数可以自动生成迭代器，那就是生成器函数
  ```js
    function* read(){
        yield 'vue';
        yield 'vite';
        yield 'node'
    }

    let it = read()
    console.log(it.next())  //{ value: 'vue', done: false }
  ```
  * 生成器和普通函数的区别是，前面需要加* ,并且配合yeild使用
  * 生成器返回一个迭代器，每次执行需要调用next方法，产出value,done
  * done为true时，迭代结束
  * 因此类数组中的迭代器可以修改为：
  ```js
    [Symbol.iterator]:function*(){
        let index = 0
        let len = this.length
        while(index!==len){
            yield this[index++]
        }
    }
  ```
  * 调用next通过传参可以给上一个yield的返回结果赋值,如果没有上一个yield，则传参无意义
  ```js
    function* read(){
        let a = yield 'vue'
        console.log(a) //11
        let b = yield 'vite'
        console.log(b) //1111
        let c = yield 'node'
        console.log(c) //11111
    }

    let it = read()
    console.log(it.next('1'))
    console.log(it.next('11'))
    console.log(it.next('1111'))
    console.log(it.next('11111'))
  ```
* promise和生成器函数结合
  * promise通过then解决串行执行流程
  * 通过promise.all解决并行执行流程
  * 但是promise依然是基于回调的，其并没有完全结果嵌套问题
  * 通过迭代器，可以使我们的异步串行代码更像是同步(底层依然是异步)
  ```js
    const fs = require("fs").promises
    const path = require("path")
    function* read(){
        let name = yield fs.readFile(path.resolve(__dirname,'name.txt'),'utf-8')
        let age = yield fs.readFile(path.resolve(__dirname,name),'utf-8')
        return age
    }
  ```
  * 但是转换成迭代器的时候依然很复杂
  ```js
    let it = read()
    let {value,done} = it.next()
    if(!done){
        value.then(data=>{
            let {value,done} = it.next(data)
            if(!done){
                value.then(data=>{
                    let {value,done} = it.next(data)
                    if(done){
                        console.log(value)
                    }
                })
            }
        })
    }
  ```
  * tj写了一个co库专门处理这个流程，我们也可以简单实现一个co库，来处理我们的生成器函数中的promise的串行调用问题
  ```js
    function co(it){
    return new Promise((resolve,reject)=>{
        function next(val){
                let {value,done} = it.next(val)
                if(!done){
                    value.then((data)=>{
                        next(data)
                    },(err)=>{
                        reject(err)
                    })
                }
                else {
                    resolve(value)
                }
        }
        next()
    })
    }
    co(read()).then(data=>console.log(data))
  ```
  * 将生成器函数放入babel中进行还原，可以看到它的源码大概如下：
  ```js
    var _marked = /*#__PURE__*/regeneratorRuntime.mark(read);

    function read() {
        var a, b, c;
        return regeneratorRuntime.wrap(function read$(_context) {.
            while (1) { // while(true) 表示这个东西是一个状态机，根据状态的变化实现对应的逻辑， 这个逻辑会走多次
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return 'vue';

                    case 2:
                        a = _context.sent;
                        console.log(a, 'a');
                        _context.next = 6;
                        return 'vite';

                    case 6:
                        b = _context.sent;
                        console.log(b, 'b');
                        _context.next = 10;
                        return 'node';

                    case 10:
                        c = _context.sent;
                        console.log(c, 'c');

                    case 12:
                    case "end":
                        return _context.stop();
                }
            }
        }, _marked);
    }

  ```
  * 结合之前迭代器的知识可以分析这个源码流程
    * 调用read函数返回一个迭代器，即regeneratorRuntime.wrap()返回一个迭代器
    * 迭代器包含一个next方法，调用next方法返回value和done
    * 而wrap里面的回调是一个状态机用来获取yeild后面对应的结果
      * 那么wrap回调的结果是value
      * 回调传入context来保证swith走哪一步,说明context里面包含对应的指针
      * next可以传参给上一个yield的返回值,从而加入到switch流程中，说明context中必定会记录next函数的传参
      * 通过调用next来实现switch进入哪一步，说明next中会调用wrap,wrap中的switch每走到下一步，会控制指针指向下下一个
    * 因此我们可以尝试还原regeneratorRuntime类
  ```js
    const regeneratorRuntime = {
        mark(fn){
            return fn
        },
        wrap(iteratorFn){
            const _context = {
                next:0,
                sent:null,
                done:false,
                stop(){
                    _context.done=true
                }

            }
        return  {
            next(val){
                _context.sent =val
                return {
                    value:iteratorFn(_context),
                    done:_context.done
                }
        }
        }
        }
    }
  ```
  * 而async和await就是 co和生成器函数配合promise的语法糖，而async成为目前解决异步串行的最终方法
  ```js
    const fs = require("fs").promises
    const path = require("path")

    async function read(){
        let name = await  fs.readFile(path.resolve(__dirname,'name.txt'),'utf-8')
        let age = await  fs.readFile(path.resolve(__dirname,name),'utf-8')
        return age
    }

    read().then(data=>{
        console.log(data)
    })
  ```