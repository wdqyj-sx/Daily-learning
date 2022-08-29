class Stack{
    constructor(n){
        this.arr = new Array(n)
        this.top = -1
    }
}
Stack.prototype.push(value){
    this.arr[++this.top] = value
}
Stack.prototype.pop = function(){
    if(this.empty()){
        return 
    }
    return this.arr[this.top--]
}
//查看栈顶元素
Stack.prototype.peek = function(){
    if(this.empty()){
        return
    }
    return this.arr[this.top]
}

//为空
Stack.prototype.empty = function(){
    return this.top == -1
}

//判断元素个数

Stack.prototype.size = function(){
    return this.top+1
}
