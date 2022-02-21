let fn = function(){
    this.foo = function(){
        console.log('sx')
    }
}

let fn1 = new fn()

// let fn = function(){
// }
// fn.prototype.foo = function(){
//     console.log('sx')
// }

// let fn1 = new fn()