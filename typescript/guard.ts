function getLength(input:string|number):number{
    const str = input as string
    if(str.length){
        return str.length
    }else {
        let num = input as number
        return num.toString().length
    }
}

function getLength2(input:string | number):number{
    if(typeof input === 'string'){
        return input.length
    }else {
        return input.toString().length
    }
}