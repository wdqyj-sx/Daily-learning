const axios = require("axios");
const inquirer = require("inquirer");
const ora = require("ora");
const fs = require('fs')
const downloadFn = require("download-git-repo")
const { promisify} = require('util')

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
        api+=`#${atg}`
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
        await downloadFn(repo,)
    }

}
module.exports = async function (proname) {
    //获取模板列表
    let repos = addLoading(fetchRepoList)()
    //根据模板列表设置用户交互
    let { tmpname } = inquirer.prompt({
        //用户交互配置
        type:'list',//列表选择类型
        name:'tmpname',//接收用户回应的对象名
        message:'请选择目标仓库',
        choices:repos //所提供的选项
    })
    //接收到用户的选择之后，开始获取该选择下的模板的版本号
    let tags = addLoading(fetchTagList)(tmpname)
    //有的模板有多个版本号，此时需要用户选择哪一个，有的模板则只有一个版本号，直接下载即可
    if(tags.length){
        //如果有多个版本号，继续和用户交互
        let {tagv} = inquirer.prompt({
            type:'list',
            name:'tagv',
            message:'请选择模板版本号',
            choices:tags
        })
        //开始下载
    }else {
        let {isDownload} = inquirer.prompt({
            type:'confirm',
            name:'isDownload',
            message:"不存在多个版本，是否直接下载"
            
        })
        if(isDownload){
            //开始下载
        }
        else {
            return;
        }
    }

};
