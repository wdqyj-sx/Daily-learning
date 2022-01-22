
class MayBe{
    static of(value){
        return new MayBe(value)
    }

    constructor(value){
        this._value = value
    }

    map(fn){
        return this.isNothing()? MayBe.of(null):MayBe.of(fn(this._value))
    }

    isNothing(){
        return this._value === null || this._value === undefined
    }
}

const f = MayBe.of('hellow')
            .map(x=>x.toUpperCase())
            .map(x => null)
            .map(x=>x+1)
            console.log(f)