function removeLastChar (str, char) {
    if(typeof str === 'string'){
        let index = str.lastIndexOf(char)
        if(index != -1){
            return str.substring(0,index) + str.substring(index+1)
        }
        else return str
    }
   
}

console.log(removeLastChar('helloword','d'))