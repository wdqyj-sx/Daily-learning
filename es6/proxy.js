const person = {
    name:'sx',
    age:18
}

const personProxy = new Proxy(person,{
    get(target,property){
        console.log('get')
        return property in target? target[property]:'undefine'
    },
    set(target,property,value){
        console.log('set')
        if(property === 'age'){
            if(!Number.isInteger(value)){
                throw new TypeError(`${value} is not int`)
            }
        }
        target[property] = value
    }

})

console.log(personProxy.name)
console.log(personProxy.hobby = 'song')