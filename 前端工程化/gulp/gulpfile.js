const {series,parallel} = require("gulp")

const foo1 = done=>{
    //执行的操作
    console.log('foo1')
    //调用回调，结束任务
    done()
}

const foo2 = done =>{
    setTimeout(() => {
        console.log('foo2')
        done()
    }, 1000);
}

const foo3 = done =>{
    setTimeout(() => {
        console.log('foo3')
        done()
    }, 1000);
}

//串行
exports.foo = series(foo1,foo2,foo3)
//并行
exports.bar = parallel(foo1,foo2,foo3)

