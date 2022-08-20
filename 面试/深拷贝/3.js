function deepCopy(source){
    if(typeof source !=='object' || typeof source == null){
        return source
    }
    const target = Array.isArray(source) ? []:{}
    for(let key in source){
        if(typeof source[key] === 'object' && source[key] !==null ){
            target[key] = deepCopy(source[key])
        }else {
            target[key] = source[key]
        }
    }
    return target
}

let a = {
    a:{
        sx:1,
        sxx:function(){
            console.log('sx')
        }
    },
    b:[1,2,3]
}
console.log(deepCopy(a))