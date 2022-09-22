const nodeXlsx = require('node-xlsx')
const fs = require('fs')
const exc = nodeXlsx.parse('./广州新冠肺炎疫情历史总数据下载.xls')
let excel_content = exc[0].data
let title = excel_content[0]
let data = excel_content.slice(1).reverse()
let newD = []
let c1=c2=c3=c4=c5=c6=c7 = 0
let count = 0
function getMon(m){
    let monD = m.split('/')
    let mon = monD[0]+'年'+monD[1]+'月'
    return mon
}
let mon = getMon(data[0][2])

for(let i = 0;i< data.length;++i){
    if(mon == getMon(data[i][2])){
        c1=data[i][3]==undefined?0:parseInt(data[i][3])
        c2=data[i][4]==undefined?0:parseInt(data[i][4])
        c3+=data[i][5]==undefined?0:parseInt(data[i][5])
        c4+=data[i][6]==undefined?0:parseInt(data[i][6])
        c5+=data[i][7]==undefined?0:parseInt(data[i][7])
       
        count++
        if(i === data.length-1){
            let arr = [
                '广东',
                '广州',
                mon,
                Math.round(c1),
                Math.round(c2),
                Math.round(c3),
                Math.round(c4),
                Math.round(c5),
               
            ]
            newD.push(arr)
        }
    }else {
        let arr = [
            '广东',
            '广州',
            mon,
            Math.round(c1),
            Math.round(c2),
            Math.round(c3),
            Math.round(c4),
            Math.round(c5),
          
        ]
        newD.push(arr)
        mon = getMon(data[i][2])
        c1=data[i][3]==undefined?0: parseInt(data[i][3])
        c2=data[i][4]==undefined?0: parseInt(data[i][4])
        c3=data[i][5]==undefined?0: parseInt(data[i][5])
        c4=data[i][6]==undefined?0: parseInt(data[i][6])
        c5=data[i][7]==undefined?0: parseInt(data[i][7])
        count = 0
        count++

    }
}
newD.unshift(title.slice(0,8))
// console.log(newD)
let buffer = nodeXlsx.build([{name:'广州',data:newD}])
fs.writeFileSync('./广州.xls',buffer,{'flag':'w'})