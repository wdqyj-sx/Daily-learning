const {src,dest} = require("gulp")
//引入自动加载插件
const $ = require("gulp-load-plugins")()
// 引入sass插件
const sass = require('gulp-sass')(require('sass'));
//安装css处理插件
var autoprefixer = require('autoprefixer');
const filePath = require("./gulpConfig")


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

module.exports = {
    style
}