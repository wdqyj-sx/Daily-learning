// setTimeout(function(){
//     console.log('setTimeout')
// },0)

// setImmediate(function(){
//     console.log('setImmediate')
// })

require('fs').readFile('./node事件环.md',(err,data)=>{
    setTimeout(function(){
        console.log('setTimeout')
    },0)

    setImmediate(function(){
        console.log('setImmediate')
    })
})