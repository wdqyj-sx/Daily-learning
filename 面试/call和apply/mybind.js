Function.prototype.myBind = function(){
    let _this = this
    let context = [].shift.call(arguments)
    let args = [].slice.call(arguments)
    return function(){
        return _this.apply(context,[].concat.call(args,arguments))
    }
}