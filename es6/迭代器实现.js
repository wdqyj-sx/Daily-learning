
let obj = {
    store:[1,2,3,4],
    [Symbol.iterator]:function(){
        let index = 0;
        let self = this
        return {
            next:function(){
                return {
                    value:self.store[index],
                done:index++ >= self.store.length
                }
            }
        }
    }
}

for(const item of obj){
    console.log(item)  //1 2 3 4
}