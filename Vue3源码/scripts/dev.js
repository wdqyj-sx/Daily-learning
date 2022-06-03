const args = require("minimist")(process.argv.slice(2))
const path = require('path')

//对接收的文件做处理
const target = args._[0] || 'reactivity'
const format = args.f||'global'
const entry = path.resolve(__dirname,`../packages/${target}/src/index.ts`);
//定义打包格式
// iife 自执行函数 global  (function(){})()  增加一个全局变量
// cjs  commonjs 规范
// esm es6Module
const outputFormat = format.startsWith('global')?'iife':format === 'cjs'?'cjs':'esm'
//出口文件
const outfile = path.resolve(__dirname,`../packages/${target}/dist/${target}.${format}/index.js`)

//引入打包模块
const {build} = require('esbuild');

build({
    entryPoints: [entry],
    outfile,
    bundle: true,
    sourcemap: true,
    format: outputFormat,
    // globalName,
    platform: format === 'cjs' ? 'node' : 'browser',
    watch: { // 监控文件变化
        onRebuild(error) {
            if (!error) console.log(`rebuilt~~~~`)
        }
    }
}).then(() => {
    console.log('watching~~~')
})
