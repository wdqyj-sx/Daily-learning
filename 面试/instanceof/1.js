function myInstanceof (left,right){
    //获取构造函数显示原型
    let rightP = right.prototype
    //获取实例隐形原型
    let leftP = left.__proto__
    while(true){
        if(leftP === null){
            return false
        }
        if(leftP === rightP){
            return true
        }
        leftP = leftP.__proto__
    }
}

console.log(myInstanceof([1,2,3],Array))