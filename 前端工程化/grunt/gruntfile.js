const sass = require("sass")
const loadGruntTasks = require("load-grunt-tasks")

module.exports = grunt =>{
    grunt.initConfig({
        // 配置目标
      clean:{
          app:'app/*.js'
      },
      //配置sass
      sass:{
          options:{
              //表示转换要依赖的工具，这里使用sass官方提供的转换工具
            implementation:sass
          },
          main:{
              files:{
                //   表示转化的文件，前者转换后的目标，后者要转换的文件
                'dist/index.css':'sass/index.scss'
              }
          }
      },
      babel:{
          main:{
              files:{
                  //
              }
          }
      }
    })
    //自动加载所有插件
   loadGruntTasks(grunt)
}