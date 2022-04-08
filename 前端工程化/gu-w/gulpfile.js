const {src,dest} = require("gulp")
//引入自动加载插件
const $ = require("gulp-load-plugins")()
// 引入sass插件
const sass = require('gulp-sass')(require('sass'));
//安装css处理插件
const autoprefixer = require('autoprefixer');
//模块删除
const del = require("del")
const filePath = require("./gulpConfig")


//删除文件
const clean =()=> del([filePath.build.dist])
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
    .pipe(dest(filePath.build.dist))
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
    .pipe(dest(filePath.build.dist))
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

module.exports = {
    style,
    clean,
    scripts,
    image
}