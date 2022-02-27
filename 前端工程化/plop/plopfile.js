module.exports = plop =>{
    //项目名称
    plop.setGenerator('component',{
        //项目描述
        description:'create a component',
        //接收用户操作
        prompts:[{
            type:'input',
            name:'name',
            message:'component name',
            default:'MyComponent'
        }],
        //规定用户输入完之后的行为
        actions:[{
            type:'add',//代表添加文件
            path:'src/components/{{name}}/{{name}}.js',//操作文件的路径
            templateFile:'plop-templates/component.hbs'//文件渲染的模板位置

        }]
    })
}