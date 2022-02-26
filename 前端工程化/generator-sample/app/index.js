const Generator = require("yeoman-generator")

module.exports = class extends Generator{
    //yeoman会在生成文件阶段调用这些方法
    prompting(){
        //使用父类的prompt方法接收
        return this.prompt([
            {
                type:'input',
                name:'title',
                message:'your name',
                default:this.appname
            },{
                type:'input',
                name:'sx',
                message:'your sign',
                default:'sx'
            }
        ]).then(ans=>{
            //将接收的结果挂在到全局
            this.ans = ans
        })
    }
    write(){
        //获取当前模板文件路径
        const tml = this.templatePath('foo.html')
        //输出路径
        const output = this.destinationPath('newfoo.html')
        //使用全局接收对象
        const context = this.ans
        this.fs.copyTpl(tml,output,context)
    }
}