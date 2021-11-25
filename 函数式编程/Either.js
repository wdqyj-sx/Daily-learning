class Left {
    static of(value){
        return new Left(value)
    }

    constructor(value){
        this._value = value
    }

    map(fn){
        return this
    }
}

class Right{
    static of(value){
        return new Right(value)
    }

    constructor(value){
        this._value = value
    }

    map(fn){
        return new Right(fn(this._value))
    }
}

function parseJson(json){
    try{
        return Right.of(JSON.parse(json))
    }
    catch(e){
        return Left.of({error:e.message})
    }
}

let r = parseJson('{name:"sx"}')
    .map(x => x.name.toUpperCase())
    console.log(r)