const { src, dest, series, parallel, watch } = require("gulp")
const sass = require('gulp-sass')(require("sass"))
const autoprefixer = require("autoprefixer")
const gulpLoadPlugins = require("gulp-load-plugins")
const babel = require("gulp-babel")
const del = require('del')
// const bs = require('browser')

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
    watch('src/assets/styles/*.scss', style)
    watch('src/assets/scripts/*.js', script)
    watch('src/**/*.html', page)
    //以下文件改动不需要调用构建命令，刷新浏览器即可
    watch([
        'src/assets/fonts/**',
        'src/assets/images/**',
        'public/**'
    ], bs.reload)
    bs.init({
        notift: false,
        prot: 2080,
        //监听的文件
        files: 'dist/**',
        server: {
            //查找的目录
            baseDir: ['dist', 'src', 'public'],
            //路由查找规则
            routers: {
                '/node_modules': 'node_modules'
            }
        }
    })
}
const clean = () => del(['dist'])

const compile = parallel(style, script, page)
module.exports = {
    compile,
    clean,
    extra
}

