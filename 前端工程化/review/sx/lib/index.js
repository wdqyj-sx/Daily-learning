//  lib/index.js

module.exports = function(aname,argv){
    //引入指令相对应的模块，传入用户输入的操作
    require('./'+aname)(...argv)
}