const axios = require('axios').default
const fs = require('fs')
axios.get("https://ncov.dxy.cn/ncovh5/view/pneumonia?from=dxy&source=&link=&share=").then(function(data){
    if(data.status == 200){
        let html = data.data
        let index1 = html.indexOf('[{"provinceName":"台湾","provinceShortName":"台湾",')
        let index2 =html.indexOf('}catch(e){}</script>')
        console.log(index1,index2)
        let mainData = html.slice(index1,index2)
        mainData = JSON.parse(mainData)
    }
})
.catch(err=>{
    console.log(err)
})