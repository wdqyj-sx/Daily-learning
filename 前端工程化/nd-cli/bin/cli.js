#! /usr/bin/env node

const inquirer = require("inquirer")
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

inquirer
    .prompt([
        {
            type:"input",
            name:'projectName',
            message:'请输入项目名称',

        },{
            type:'list',
            name:'choiceModule',
            message:'请选择采用模块',
            choices:['jquery','bootstrap','layui'],
            validate:function(ans){
                if(ans.length<1){
                    return '选择错误'
                }
                return true
            }
        }
    ])
    .then(ans=>{
        let ppath = process.cwd()
        let tmp = path.join(ppath,'templates')
        fs.readdir(tmp,(err,files)=>{
            if(err){
                throw err
            }
            files.forEach(file=>{
                ejs.renderFile(path.join(tmp,file),ans,(err,result)=>{
                    if (err) 
                        throw err
                    fs.writeFileSync(path.join(ppath,'file'),result)
                    
                })
            })
        })
    })