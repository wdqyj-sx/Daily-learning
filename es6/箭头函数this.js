obj = {
    name:'sx',
    Fn:function(){
        let _this = this
        setTimeout(function(){
            console.log(_this.name)
        },0)
    },
    Fn2:function(){
        setTimeout(()=>{
            console.log(this.name)
        },0)
    }
}
obj.Fn()
obj.Fn2()