const regeneratorRuntime = {
    mark (genFn) {
        return genFn
    },
    wrap (iteratorFn) {
        //初始化一个上下文
        const context = {
            next: 0,
            done: false,//表示是否执行完毕
            stop () {
                this.done = true
            }
        }
        let it = {}
        it.next = function (v) {
            let value = iteratorFn(context)
            return {
                value,
                done: context.done
            }
        }
        return it
    }


}