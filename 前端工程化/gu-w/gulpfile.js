const {src,dest,series,parallel,watch} = require("gulp")
//引入自动加载插件
const $ = require("gulp-load-plugins")()
// 引入sass插件
const sass = require('gulp-sass')(require('sass'));
//安装css处理插件
const autoprefixer = require('autoprefixer');
//模块删除
const del = require("del")
const filePath = require("./gulpConfig")
const bs = require('browser-sync');
const styleLint = require("stylelint")
const reporter = require("postcss-reporter")


//删除文件
const clean =()=> del([filePath.build.dist,filePath.build.temp])
// 将sass转成css
const style = ()=>{
    return src(filePath.build.path.styles,{
        base:filePath.build.src,
        cwd:filePath.build.src,
        sourcemaps:true
    })
    .pipe(sass())
    .pipe($.postcss([autoprefixer({
        //兼容所有版本
        overrideBrowserslist: ['> 0.15% in CN'],
        //是否美化属性
        cascade:true
    })]))
    .pipe(dest(filePath.build.temp))
}
//将es6转化为es5
const scripts = ()=>{
    return src(filePath.build.path.scripts,{
        base:filePath.build.src,
        cwd:filePath.build.src,
        sourcemaps:true
    })
    .pipe($.babel({
        presets:['@babel/preset-env']
    }))
    .pipe(dest(filePath.build.temp))
}


let option = {}
//处理html
const page = ()=>{
    return src(filePath.build.path.pages,{
        ignore:['layouts','partials'],
        base:filePath.build.src,
        cwd:filePath.build.src
    })
    .pipe($.swig(option))
    .pipe(dest(filePath.build.temp))

}
//压缩image,font
const image = ()=>{
    return src(filePath.build.path.images,{
        base:filePath.build.src,
        cwd:filePath.build.src
    })
    .pipe($.imagemin())
    .pipe(dest(filePath.build.dist))
}
const font = ()=>{
    return src(filePath.build.path.fonts,{
        base:filePath.build.src,
        cwd:filePath.build.src
    })
    .pipe($.imagemin())
    .pipe(dest(filePath.build.dist))
}
const proServe = ()=>{
    bs.init({
        notify:false,
        server:{
            baseDir:filePath.build.dist,
        }
    })
}
const devServe = ()=>{

    watch(filePath.build.path.styles,{cwd:filePath.build.src},style);
    watch(filePath.build.path.scripts,{cwd:filePath.build.src},scripts);
    watch(filePath.build.path.pages,{cwd:filePath.build.src},page);
    watch([filePath.build.path.fonts,filePath.build.path.images],{
        cwd:filePath.build.src
    },bs.reload);

    bs.init({
        notify:false,
        files:filePath.build.temp+'/**',
        server:{
            baseDir:[filePath.build.dist,filePath.build.temp,filePath.build.src],
            routes:{
                '/node_modules':'node_modules'
            }
        }
    })
}
const extra = ()=>{
    return src('**',{
        base:filePath.build.public,
        cwd:filePath.build.public
    })
    .pipe(dest(filePath.build.dist))
}
const useref = ()=>{
    return src(filePath.build.path.pages,{
        base:filePath.build.temp,
        cwd:filePath.build.temp
    })
    .pipe($.useref({
        searchPath:[filePath.build.temp,'.','..']
    }))
    .pipe($.if(/\.js$/,$.uglify()))
    .pipe($.if(/\.css/,$.cleanCss()))
    .pipe($.if(/\.html/,$.htmlmin({
        collapseWhitespace:true,
        minifyCSS:true,
        minifyJS:true
    })))
    .pipe(dest(filePath.build.dist))
}   
const compile = parallel(style,scripts,page)
const build = series(clean,compile,useref,extra)

const serve = series(compile,devServe)
const start = series(build,proServe)
module.exports = {
    style,
    clean,
    scripts,
    image,
    page,
    compile,
    proServe,
    devServe,
    serve,
    extra,
    useref,
    build,
    start
}