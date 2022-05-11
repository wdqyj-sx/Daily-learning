
function Ajax(method,url,data){
    return new Promise((resolve,reject)=>{
        // let xhr = new XMLHttpRequest();
        var xhr = new XMLHttpRequest();
        // let method = method||'GET'
        let data = data || null
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4 ){
                if(xhr.status === 200){
                    resolve(xhr.responseText)
                }else {
                    reject(xhr.responseText)
                }
            }
        }
        //get 
        if(method.toLowerCase() === "get"){
            if(typeof data === 'object' && data!=null){
                data = Object.keys(data).map(key=>{
                    return encodeURIComponent(key)+'='+encodeURIComponent(data[key])
                }).join('&')
            }
            url = data? url+"?"+data:url
            xhr.open(method,url)
            xhr.send()
        }
        if(method.toLowerCase() === 'post'){
            xhr.open(method,url,true)
            xhr.setRequestHeader("Content-type", "application/json; charset=utf-8")
            xhr.send(JSON.stringify(data))
        }

    })
}

Ajax('get','../README.md').then(result=>{
    console.log(result)
},err => {
    console.log(err)
})