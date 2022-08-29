function cloneDeep(source,hash = new Map()){
    if(typeof source !== 'object' || source === null){
        return source
    }
    if(hash.has(source)){
        return hash.get(source)
    }
    const target = Array.isArray(source)?[]:{}
    Reflect.ownKeys(source).forEach(key=>{
        if(typeof source[key] === 'object' && source[key] !== null){
            
        }
    })
}