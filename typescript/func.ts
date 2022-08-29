let add = (x:number,y:number,z?:number) :number =>{
    return x+y
}

interface iSum {
   ( x:number,
    y:number,
    z?:number):number
}

let add2:iSum = add