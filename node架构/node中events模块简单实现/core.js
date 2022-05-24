function EventEmitter(){
    this._events = {}
}

EventEmitter.prototype.on = function(eventName,callback){
    if(!this._events){
        this._events = {}
    }
    if(eventName!=="newLister"){
        this.emit("newLister",)
    }
}

EventEmitter.prototype.emit = function(){

}



module.exports = EventEmitter