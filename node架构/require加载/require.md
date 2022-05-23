### node中require加载机制
> node中的模块加载规范为commonJS规范，规范中通过require来引入模块。
#### require源码探究
* 暴漏出一个text模块
  ```js
    let str = 'hello world'
    module.exports = str
  ```
* node中的源码无法通过打断点进行调试，这里借助vscode，在debug模式中，新建launch.js文件，并且将"skipFiles"内容 清空，表示不跳过node核心代码,然后在require处打断点，即可进入require内部源码中
  ```json
    {
        // 使用 IntelliSense 了解相关属性。 
        // 悬停以查看现有属性的描述。
        // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
        "version": "0.2.0",
        "configurations": [
            {
                "type": "pwa-node",
                "request": "launch",
                "name": "Launch Program",
                "skipFiles": [
                    // "<node_internals>/**"
                ],
                "program": "${workspaceFolder}\\node架构\\require加载\\require加载.js"
            }
        ]
    }
  ```
* 分析源码执行流程：
  * require一个模块后，默认调用Module._load方法,传入require的文件名
  * 通过Module._resolveFilename方法，解析文件名，此时会默认添加文件的后缀，返回文件路径
  * 创建当前模块实例const module =  new Module() => {id:文件名,exports:{}}
  * 调用module.load()方法，传入解析的文件名
  * 根据文件的后缀名来调用相关的读取方法 Module._extensions[extension](this, filename);
    * 此时会将模块内容读出来，内容为字符串形式
  * 调用module._compile方法，通过该方法将text的内容包装成一个函数字符串
    ```js
    function(){
        let str = 'hello world'
        module.exports = str
    }
    ```
  * 通过vm.compileFunction()执行该字符串变成一个真的函数并执行，执行会把数据给module.exports  
  * 最终返回module.exports
#### 模块源码简单实现
* 调用require，会执行Module类中的一些列方法，首先要创建Module类，并分别添加相对应方法
  ```js
    function Module(id){
        this.id = id
        this.export = {}
    }
  ```
* 对文件的全局路径查找
  * require中传入的参数本质上是一个文件名，这个文件名可以不加后缀，依次在查找的时候 需要考虑
    * 若有后缀，则直接拼接路径，存在该路径下的文件，则返回
    * 若无后缀，则需在第一步基础上不断拼接可能的后缀，同时判断该路径是否存在文件，若存在，则返回
    * 两种情况都不符合，则报错
  ```js
    Module._resolveFilename = function(id){
        const filePath = path.resolve(__dirname,id)
        //如果有后缀
    if(fs.existsSync(filePath)){
        return filePath
    }
    //如果无后缀
    const exts =  Object.keys(Module._extension);
    for(let i = 0;i<exts.length;++i){
        let file = filePath+exts[i]
        if(fs.existsSync(file)){
            return file
        }
    }
    throw Error('Cannot find module:' + id)
    }

    Module._extension = {
        '.js'(){},
        '.json'(){}
    }
  ```
* 之后创建一个新的module实例
* 调用实例中的load方法，截取扩展名
  ```js
    Module.prototype.load = function(filename){
        let ext = path.extname(filename)
        Module._extension[ext](this)
    }
  ```
* 调用Module._extension方法对引入的文件进行内容读取,使用函数包裹模块内容，调用函数，将内容给module.exports
  ```js
    Module._extension = {
        '.js'(module){
            //读取模块内容
            const content = fs.readFileSync(module.id,'utf8')
            //获取包裹函数
            let wrapperFn = vm.compileFunction(content,['exports','require','module','__filename','__dirname'])
            let exports = this.exports
            let thisValue = exports
            let require = myRequire
            let filename = module.id
            let dirname = path.dirname(filename)
            Reflect.apply(wrapperFn,thisValue,[exports, require, module, filename, dirname])
        },
        '.json'(module){
            //若内容是json，则直接赋值
            const content = fs.readFileSync(module.id,'utf8')
            module.exports = JSON.parse(content)
        }
    }
  ```
* 最终myRequire函数为：
  ```js
    function myRequire(id){
        //获取完整路径
    let absPath = Module._resolveFilename(id)
    const module = new Module(absPath)
    module.load(absPath)
    return module.exports
    }
  ```
* 测试
    ```js
        let str = myRequire('./text')
        console.log(str)  //hello world
    ```