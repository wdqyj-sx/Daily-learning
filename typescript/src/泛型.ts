function createArray<T> (length:number,value:T):T[] {
    const arr = Array<T>(length).fill(value)
    return arr
}

const res = createArray<string>(3,'sx')