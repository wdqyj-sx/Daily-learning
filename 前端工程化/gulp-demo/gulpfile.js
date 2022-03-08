const {src,dest,parallel,series,watch} = require("gulp") 
const loadPlugins = require("gulp-load-plugins")
const sass = require("gulp-sass")(require("sass"))
const del = require("del")
const bs = require("browser-sync")
const plugins = loadPlugins()

const clean = ()=>{
    return del(['dist','temp'])
}
  
const style = ()=>{
    //读入样式文件,base:src表示写入的文件保留src之后的文件层级
    return src('src/assets/styles/*.scss',{base:'src'})
    //将sass文件转换,且样式的括号打开
    .pipe(sass({outputStyle:'expanded'}))
    .pipe(dest('temp'))
}
const script = ()=>{
    return src("src/assets/scripts/*.js",{base:'src'})
    .pipe(plugins.babel({presets:['@babel/preset-env']}))
    .pipe(dest('temp'))
}

const data = {
    menus: [
      {
        name: 'Home',
        icon: 'aperture',
        link: 'index.html'
      },
      {
        name: 'Features',
        link: 'features.html'
      },
      {
        name: 'About',
        link: 'about.html'
      },
      {
        name: 'Contact',
        link: '#',
        children: [
          {
            name: 'Twitter',
            link: 'https://twitter.com/w_zce'
          },
          {
            name: 'About',
            link: 'https://weibo.com/zceme'
          },
          {
            name: 'divider'
          },
          {
            name: 'About',
            link: 'https://github.com/zce'
          }
        ]
      }
    ],
    pkg: require('./package.json'),
    date: new Date()
  }
const page = ()=>{
    return src("src/**/*.html",{base:'src'})
    //渲染模板，传入数据
    .pipe(plugins.swig({data}))
    .pipe(dest('temp'))
    
}

const image = ()=>{
    return src("src/assets/images/**",{base:'src'})
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}

const font = ()=>{
    return src("src/assets/fonts/**",{base:'src'})
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}
const extra = ()=>{
    return src("public/**",{base:'public'})
    .pipe(dest("dist"))
}
const serve = ()=>{
    //监听
    watch('src/assets/styles/*.scss',style)
    watch("src/assets/scripts/*.js",script)
    watch("src/**/*.html",page)
    //下面的资源文件监听，服务器执行刷新命令即可
    watch([
        "src/assets/images/**",
        "src/assets/fonts/**",
        "public/**"
    ],bs.reload)

    bs.init({
        notify:false,//是否提示
        port:2080,
        //监听的文件，文件改变，浏览器刷新
        files:'dist/**',
        server:{
              //指定网站根目录
            baseDir:['temp','src','public'],
            routes:{
                //dist中html文件引入node_modules中的模块，这里告诉浏览器如果html中有/node_modules，就直接去根目录下的node_modules中找，后面会将node_modules中需要的文件提取到dist中
                '/node_modules':'node_modules'
            }
        }

    })
}
const useref = ()=>{
    return src("temp/*.html",{base:'temp'})
    //搜索的位置，本项目css文件，一般在dist,node_modules中
    .pipe(plugins.useref({ searchPath:['temp','.'] }))
    //判断是否.js结尾文件并压缩
    .pipe(plugins.if(/\.js$/,plugins.uglify()))
    .pipe(plugins.if(/\.css$/,plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/,plugins.htmlmin({
        collapseWhitespace:true, //压缩空格
        minifyCSS:true,//压缩行内样式
        minifyJS:true //压缩内部js
    })))
    .pipe(dest('dist'))
}
const compile = parallel(style,script,page)
const build = series(clean,parallel( series(compile,useref), extra,image,font))
const develop = series(compile,serve) 
module.exports = {
    compile,
    build,
    serve,
    develop,
    useref
}