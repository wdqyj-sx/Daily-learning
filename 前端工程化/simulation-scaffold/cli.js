#! /usr/bin/env node
//开头要有一个这个格式的头文件文件

const inquirer = require("inquirer")
const ejs = require("ejs")
const fs = require("fs")
const path = require("path")
//接受用户的配置
inquirer.prompt([
    {
        type: 'input', //用户输入类型,
        name: 'projectName',//输入的键
        message: 'Project name' //默认提示
    }
])
    .then(ans => {
        //收集到用户的输入
        //获取渲染文件夹路径
        const tmpDir = path.join(__dirname, 'template')
        const targetDir = process.cwd()
        //读取路径下每一个文件
        fs.readdir(tmpDir, (err, file) => {
            if (err) {
                throw err
            }
            //ejs渲染文件
            file.forEach(fe=>{
                ejs.renderFile(path.join(tmpDir,fe),ans,(err,result)=>{
                    if(err)
                         throw err
                     fs.writeFileSync(path.join(targetDir,fe),result)
                })
            })
          
        })
    })
