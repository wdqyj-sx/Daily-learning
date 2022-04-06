const { src, dest, series, parallel, watch } = require("gulp")
const sass = require('gulp-sass')(require("sass"))
const autoprefixer = require("autoprefixer")
const gulpLoadPlugins = require("gulp-load-plugins")
const babel = require("gulp-babel")
const del = require('del')
// const bs = require('browser')
const bs = require("browser-sync")

const plugins = gulpLoadPlugins()
// console.log(plugins)

//处理style
const style = () => {
    return src('src/assets/styles/*.scss', { base: 'src' })
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(plugins.postcss([
            autoprefixer()
        ]))
        .pipe(dest('dist'))
}

const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src' })
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(dest('dist'))
}

const image = () => {
    return src('src/assets/images/**', { base: 'src' })
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))
}

const font = () => {
    return src('src/assets/fonts/**', { base: 'src' })
        .pipe(plugins.imagemin())
        .pipe(dest('dist'))

}

const page = () => {
    return src('src/**/*.html', {
        base: 'src',
        ignore: ['{layots,partials}/**']
    })
        .pipe(plugins.swig())
        .pipe(dest('dist'))
}

//public文件夹直接复制
const extra = () => {
    return src('public/**', { base: 'public' })
        .pipe(dest('dist'))
}

//实现浏览器热更新及文件监视
const devServe = () => {
    //监听
    watch('src/assets/styles/*.scss', style)
    watch("src/assets/scripts/*.js", script)
    watch("src/**/*.html", page)
    //下面的资源文件监听，服务器执行刷新命令即可
    watch([
        "src/assets/images/**",
        "src/assets/fonts/**",
        "public/**"
    ], bs.reload)

    bs.init({
        notify: false,//是否提示
        port: 2080,
        //监听的文件，文件改变，浏览器刷新
        files: 'dist/**',
        server: {
            //指定网站根目录
            baseDir: ['dist', 'src', 'public'],
            routes: {
                //dist中html文件引入node_modules中的模块，这里告诉浏览器如果html中有/node_modules，就直接去根目录下的node_modules中找，后面会将node_modules中需要的文件提取到dist中
                '/node_modules': 'node_modules'
            }
        }

    })

}
const useref = ()=>{
    return src("dist/*.html",{base:'dist'})
    //搜索的位置，本项目css文件，一般在dist,node_modules中
    .pipe(plugins.useref({ searchPath:['dist','.'] }))
    .pipe(dest('dist'))
 
}
const clean = () => del(['dist'])

const compile = parallel(style, script, page)
const serve = series(compile, devServe)

module.exports = {
    compile,
    clean,
    extra,
    devServe,
    useref
}

