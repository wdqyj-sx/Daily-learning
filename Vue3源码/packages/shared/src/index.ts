export const isObject = (value)=>{
    return typeof value === 'object'&& value !==null
}

export const isFunction = (value) => {
    return typeof value === 'function'
}

export const isString = (value)=>{
    return typeof value === 'string'
}

export const isNumber = (value)=>{
    return typeof value === 'number'
}

export const isArray = Array.isArray; 

const hasOwnProperty = Object.prototype.hasOwnProperty

export const hasOwn = (obj,key) => hasOwnProperty.call(obj,key)
