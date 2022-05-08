//定义模块
// 参数：1.模块名，2.模块依赖项，3.自定义模块
define('module1',['jquery','./module2'],function($,module2){
    return {
        start:function(){
            $('body').animate({
                margin:'200px'
                module2()
            })
        }
    }
})

//载入模块
require(['module1'],function(module1){
    module1.start()
})























