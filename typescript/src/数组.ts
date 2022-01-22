const arr:Array<number> = [1,2,3]
const arr2:number[] = [1,2,3]

function sum(...args:number[]) {
    return args.reduce((pre,cur)=> pre+cur,0)
}