const axios = require("axios");
const inquirer = require("inquirer");
const ora = require("ora");
const fs = require('fs')
let downloadFn = require("download-git-repo")
const { promisify} = require('util');
const path = require("path");
let Metalsmith = require('metalsmith');
const ncp = require('ncp');
const cons = require("consolidate");
let {render} = require('consolidate').ejs

downloadFn = promisify(downloadFn)
//为了是传入的函数也能传入参数，采用柯里化的写法
const addLoading = function (fn) {
  return async function (...args) {
    //接收一个函数，在函数执行前后分别提示
    let spinner = ora("开始下载模板选项");
    spinner.start();
    try {
      let ret = await fn(...args);
      spinner.succeed('下载成功')
      return ret
    } catch {
        spinner.fail('下载失败')
    }
  };
};

const fetchRepoList = async function(){
    const {data} = await axios.get("https://api.github.com/users/zcegg/repos")
    //文件形式大家可以点开看一下，我们获取每个模板的名称，后期供用户选择
    let repos = data.map(item=>item.name)
    return repos

}

const fetchTagList = async function(reponame){
    const {data} = await axios.get(`https://api.github.com/repos/zcegg/${reponame}/tags`)
    let repos = data.map(item => item.name)
    return repos
}

const downloadRepo = async function(repo,tag){
    // 定义缓存目录，通过判断系统来找到相应系统的缓存路径
    let cacheDir = `${process.env[process.platform == 'win32'?'USERPROFILE':'HOME']}/.tmp`
    //按照download-git-repo格式定义api
    let api = `zcegg/${repo}`
    if(tag){
        api+=`#${tag}`
    }
    //定义模板下载后的输出路径
    let dest = path.resolve(cacheDir,repo)
    let spinner = ora('开始下载模板')
    spinner.start()
    //判断该路径是否存在
    if(fs.existsSync(dest)){
        //存在则直接使用缓存即可
        spinner.stop()
        return dest
    }else {
        await downloadFn(api,dest)
        spinner.succeed('模板下载成功')
        return dest
    }

}
module.exports = async function (proname) {
    //获取模板列表
    let repos = await addLoading(fetchRepoList)()
    
    //根据模板列表设置用户交互
    let { tmpname } = await inquirer.prompt({
        //用户交互配置
        type:'list',//列表选择类型
        name:'tmpname',//接收用户回应的对象名
        message:'请选择目标仓库',
        choices:repos //所提供的选项
    })
  
    //接收到用户的选择之后，开始获取该选择下的模板的版本号
    let tags =await addLoading(fetchTagList)(tmpname)
    //有的模板有多个版本号，此时需要用户选择哪一个，有的模板则只有一个版本号，直接下载即可
    let dest = null
    if(tags.length){
        //如果有多个版本号，继续和用户交互
        let {tagv} =await inquirer.prompt({
            type:'list',
            name:'tagv',
            message:'请选择模板版本号',
            choices:tags
        })
        //开始下载
      dest = await downloadRepo(tmpname,tagv)
    }else {
        let {isDownload} =await inquirer.prompt({
            type:'confirm',
            name:'isDownload',
            message:"不存在多个版本，是否直接下载"
            
        })
        if(isDownload){
            //开始下载
          dest = await downloadRepo(tmpname)
        }
        else {
            return;
        }
    }
    //渲染模板并将模板复制到创建的项目下
    if(fs.existsSync(path.join(dest,'que.js'))){
        //存在问题列表，则渲染数据
        console.log("正在渲染模板")
        await new Promise((resolve,reject)=>{
            Metalsmith(__dirname) //传入一个参数（语法规定）
                .source(dest) //传入要从哪里渲染
                .destination(path.resolve(proname)) //渲染到哪里
                .use(async (files,metal,done)=>{
                    //use函数是对读取的文件夹里的文件的操作，可以链式调用，执行完后调用done函数结束操作
                    //files会将所有文件夹里的数据以文件名为键，文件内容为值读成一个json数据表
                    // metal可以将数据进行往后传递
                    //获取问题列表
                    let quesArr = require(path.resolve(dest,'que.js'))
                    //交互询问
                    let ans = await inquirer.prompt(quesArr)
                    //保留答案并传递给下一个ues
                    let meta = metal.metadata()
                    Object.assign(meta,ans)
                    //将files中的que.js有关内容删除，后期会根据files进行渲染到指定工程下
                    delete files['que.js']
                    done() //表示这个操作结束
                })
                .use((files,metal,done)=>{
                    // 在这个操作中渲染模板
                    // 获取数据
                    let data = metal.metadata()
                    Reflect.ownKeys(files).forEach(  async  file=>{
                        if(file.includes('.js')||file.includes('.json')){
                            //存在.js文件或者.json文件，就需要查看其内容，是否有ejs模板痕迹，有则拿接收的数据进行渲染
                            let contents = files[file].contents.toString()
                            if(contents.includes("<%")){ 
                                //渲染内容
                              let  content = await render(contents,data)
                                //将原内容替换成渲染好的内容
                                files[file].contents = Buffer.from(content)
                            }
                        }
                    })
                    done()
                })
                //build执行复制操作,将files内容以此写入到指定项目中
                .build((err)=>{
                    if(err){
                        reject()
                    }
                    resolve()
                })
        })
    }else {
        console.log('不需要渲染数据')
        //借助ncp模块，直接复制
        // npmi ncp -D
        ncp(dest,proname)
    }
    console.log('下载完成')

};
