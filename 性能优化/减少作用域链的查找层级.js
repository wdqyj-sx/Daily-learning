//before

let name = 'sx'
function foo(){
    let getName = ()=>{
        console.log(name)
    }
}

//after

let name = 'sx'
function foo(){
    let name = 'sx2'
    let getName = ()=>{
        console.log(name)
    }
}