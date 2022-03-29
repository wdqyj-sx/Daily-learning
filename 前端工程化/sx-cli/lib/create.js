const axios = require("axios")
const inquirer = require("inquirer")
const ora = require("ora")
const {promisify} = require("util")
let downloadFn = require("download-git-repo")
const path = require("path")
const fs = require("fs")
const ncp = require("ncp")
const Metalsmith = require("metalsmith")
const {render} = require("consolidate").ejs

downloadFn = promisify(downloadFn)
//封装
//添加耗时等待方法
const addLoading = function(fn){
    return async function(...args){
        let spinner = ora("开始下载")
        spinner.start()
        try{
            let ret = await fn(...args)
            spinner.succeed('下载成功')
            return ret
        }
        catch(err){
            spinner.fail('下载失败')

        }
    }
}

//拉取仓库目录
const fetchRepoList = async function(){
    let {data} = await axios.get("https://api.github.com/users/zcegg/repos")
    let repos = data.map(item=>item.name)
    return repos
}
//获取tags列表
const fetchTagList = async function(reponame){
    let {data} = await axios.get(`https://api.github.com/repos/zcegg/${reponame}/tags`)
    
    let repos = data.map(item=>item.name)
    return repos
}
const downloadRepo = async function(repo,tag){
    //定义缓存目录
    let cacheDir = `${process.env[process.platform == 'win32'?'USERPROFILE':'HOME']}/.temp`
    let api = `zcegg/${repo}`
    if(tag){
        api+=`#${tag}`
    }
    //定义模板下载后的输出路径
    let dest = path.resolve(cacheDir,repo)
    let spinner = ora('开始下载')
    spinner.start()
    let flag = fs.existsSync(dest)
    if(flag){
        spinner.stop()
        return dest

    }else {
        await downloadFn(api,dest)
        spinner.succeed('下载结束')
        return dest
    }
}

module.exports = async function(proname){
    let repos = await addLoading(fetchRepoList)()
    //拿到模板之后开始设置问题
    let {tmpname} = await inquirer.prompt({
        type:'list',
        name:'tmpname',
        message:'请选择目标仓库模板',
        choices:repos
    })
    //拉取版本号
    let tags = await addLoading(fetchTagList)(tmpname)
    let dest = null
    if(tags.length){
        let {tagv} = await inquirer.prompt({
            type:'list',
            name:'tagv',
            message:'请选择目标版本',
            choices:tags
        })
        //根据模板名称和版本号下载
         dest = await downloadRepo(tmpname,tagv)
    }else {
        let {isDownload} = await inquirer.prompt({
            type:'confirm',
            name:'isDownload',
            message:'当前不存在多个tag是否直接下载'
        })
        if(isDownload){
             dest = await downloadRepo(tmpname)
        }else {
            return;
        }
    }
     //缓存下载完之后，需要判断有没有要渲染的文件
     if(fs.existsSync(path.join(dest,'que.js'))){
        await new Promise((resolve,reject)=>{
            Metalsmith(__dirname)
                .source(dest)
                .destination(path.resolve(proname))
                .use(async (files,metal,done)=>{
                    let quesArr = require(path.join(dest,'que.js'))
                    let ans = await inquirer.prompt(quesArr)
                    
                    //将答案传给下一个use
                    let meta = metal.metadata()
                    Object.assign(meta,ans)
                 
                    //操作完这一步，文件中的que.js就没有用了
                    delete files['ques.js']
                    done()
                })
                .use((files,metal,done)=>{
                    //拿到上一个use中的数据
                    let data = metal.metadata()
                    console.log(data)
                    Reflect.ownKeys(files).forEach(async file=>{
                        if(file.includes("js")||file.includes("json")){
                            let content = files[file].contents.toString()
                            if(content.includes("<%")){
                                content = await render(content,data)
                                files[file].contents = Buffer.from(content)
                            }
                        }
                    })
                    done()
                })
                .build((err)=>{
                    if(err){
                        console.log("拉取失败")
                        reject()
                    }else {
                        console.log("拉取成功")
                        resolve()
                    }
                })

        })
     }
     else {
         //不需要渲染的数据直接拷贝的项目中
         ncp(dest,proname)
         console.log("拉取成功")
     }

}