var FrontMiddleBackQueue = function() {
    this.leftA = []
    this.rightA = []
    this.index = 0
};

/** 
 * @param {number} val
 * @return {void}
 */
FrontMiddleBackQueue.prototype.ava = function(){
    while(this.rightA.length - this.leftA.length >1){
        this.leftA.push(this.rightA.shift())
    }
    while(this.rightA.length -  this.leftA.length <0){
        this.rightA.unshift(this.leftA.pop())
    }
}

FrontMiddleBackQueue.prototype.pushFront = function(val) {
    this.leftA.unshift(val)
    this.index++
    this.ava()
};

/** 
 * @param {number} val
 * @return {void}
 */
FrontMiddleBackQueue.prototype.pushMiddle = function(val) {
    this.leftA.push(val)
    this.index++
    this.ava()
};

/** 
 * @param {number} val
 * @return {void}
 */
FrontMiddleBackQueue.prototype.pushBack = function(val) {
    this.rightA.push(val)
    this.index++
    this.ava()
};

/**
 * @return {number}
 */
FrontMiddleBackQueue.prototype.popFront = function() {
    if(this.index === 0){
        return -1
    }
    let val =  this.leftA.shift() || this.rightA.shift()
    this.ava()
    this.index--
    return val

};

/**
 * @return {number}
 */
FrontMiddleBackQueue.prototype.popMiddle = function() {
      if(this.index === 0){
        return -1
    }
    let val
    if(this.index % 2==0){
        val = this.leftA.pop()
    }else {
        
        val =  this.rightA.shift()
    }
    this.index--
    this.ava()
    return val

};

/**
 * @return {number}
 */
FrontMiddleBackQueue.prototype.popBack = function() {
      if(this.index === 0){
        return -1
    }
    let val = this.rightA.pop() || this.leftA.pop()
    this.index--
    this.ava()
    return val

};

/**
 * Your FrontMiddleBackQueue object will be instantiated and called as such:
 * var obj = new FrontMiddleBackQueue()
 * obj.pushFront(val)
 * obj.pushMiddle(val)
 * obj.pushBack(val)
 * var param_4 = obj.popFront()
 * var param_5 = obj.popMiddle()
 * var param_6 = obj.popBack()
 */

let a = new FrontMiddleBackQueue()
a.popMiddle()
a.pushMiddle(5422)
a.pushMiddle(532228)
a.popBack()
a.pushMiddle(206486)
a.pushBack(351927)
a.popFront()
a.popFront()