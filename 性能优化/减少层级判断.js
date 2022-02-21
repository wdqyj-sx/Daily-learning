//判断是否是18岁的小明
//before

function judgeMing(name,age){
    if(name==='小明'){
        if(age === 18){
            console.log('正确')
        }
        else {
            console.log('错误')
        }
    }
    else {
        console.log('错误')
    }
}

//after

function judgeMing(name,age){
    if(name!=="小明"|| age!==18)
        console.log('错误')
    else {
        console.log('正确')
    }
}