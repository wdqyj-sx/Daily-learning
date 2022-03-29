#! /usr/bin/env node

const {program} = require("commander")
const {version} = require("../package.json")

const actionMap = {
    // 指令名为键，指令的相关配置作为值
    'create':{
        //别名
        alias:'crt',
        description:'初始化项目',//描述
        examples:['sx create <projectname>']//给用户的提示
    }
}

//遍历指令
Reflect.ownKeys(actionMap).forEach(aname=>{
    program
        .command(aname) //需要绑定的指令名称
        .alias(actionMap[aname].alias)//绑定的指令的别称
        .description(actionMap[aname].description)//绑定描述
        .action(()=>{
            //指令出发后执行什么操作
            console.log(aname)
        })
    })

//将指令绑定的提示命令中
program.on("--help",()=>{
    Reflect.ownKeys(actionMap).forEach(aname=>{
        actionMap[aname].examples.forEach(item=>{
            console.log(`${aname}:${item}`)
        })
    })
})

program
    .version(version)
    .parse(process.argv)