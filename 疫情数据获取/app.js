const axios = require('axios').default

axios.get("https://ncov.dxy.cn/ncovh5/view/pneumonia?from=dxy&source=&link=&share=").then(function(data){
    // status
    // statusText
    // headers
    // config
    // request
    // data
    if(data.status == 200){
        let html = data.data
        let index1 = html.indexOf('<script id="getAreaStat">try {')
        let index2 =html.indexOf('}]}catch(e){}</script>')
        let mainData = html.slice(index1,index2)
       
    }
})
.catch(err=>{
    console.log(err)
})