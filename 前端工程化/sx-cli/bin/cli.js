#! /usr/bin/env node

let {program} = require("commander")
let {version} = require("../package.json")

let  actionMap = {
    create:{
        alias:'crt',
        description:'初始化项目',
        examples:['sx-cli create <projectname>']
    },
    config:{
        alias:'cfg',
        description:'初始化项目配置',
        examples:[
            'sx-cli config set <k> <v>',
            'sx-cli config get <k>'
        ]
    }
}

Reflect.ownKeys(actionMap).forEach(aname=>{
    program
        .command(aname)
        .alias(actionMap[aname].alias)
        .description(actionMap[aname].description)
})

program.on('--help',()=>{
    console.log('Example:')
    Reflect.ownKeys(actionMap).forEach(aname=>{
        actionMap[aname].examples.forEach(item=>{
            console.log(`${aname}:${item}`)
        })
    })
})

program
    .version(version)
    .parse(process.argv)