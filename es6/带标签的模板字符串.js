let name = 'sx'
let age = 18

function modelFn(strings,name,age){
    console.log(strings)    // [ 'hei,我是', ',我', '岁了' ]
    console.log(name,age)   //sx 18
}

modelFn`hei,我是${name},我${age}岁了`