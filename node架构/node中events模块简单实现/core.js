function EventEmitter () {
    this._events = {}
}

EventEmitter.prototype.on = function (eventName, callback) {
    if (!this._events) {
        this._events = {}
    }
    if (eventName !== "newListener") {
        if(this._events["newListener"]){
            this._events["newListener"].forEach(fn=>fn(eventName))
        }
    }
    this._events[eventName] = this._events[eventName] || []
    this._events[eventName].push(callback)
}

EventEmitter.prototype.emit = function (eventName, ...args) {
    if (!this._events) {
        this._events = {}
    }
    this._events[eventName].forEach((cb) => {
        cb(...args)
    })
}

EventEmitter.prototype.off = function (eventName, callback) {
    if (!this._events) {
        this._events = {}
    }
    this._events[eventName] = this._events[eventName].filter(item => {
        return item !== callback && item.l !== callback
    })
}

EventEmitter.prototype.once = function (eventName, callback) {
    let once = (...args) => {
        callback(...args)
        this.off(eventName, once)
    }
    once.l = callback
    this.on(eventName, once)
}


module.exports = EventEmitter