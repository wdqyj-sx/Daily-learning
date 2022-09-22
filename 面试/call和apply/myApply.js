Function.prototype.apply = function(context){
    if(!context){
        context = window
    }
    context.fn = this
    let args = arguments[1]
    let result
    if(args){
        result = context.fn(...args)
    }else {
        result = context.fn()
    }
    delete context.fn
    return result
}