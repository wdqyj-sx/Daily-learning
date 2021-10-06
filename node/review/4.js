// let p = new Promise((resolve, reject) => {
//     resolve('sx')
// })

// p.then()
//     .then()
//     .then((value) => {
//         console.log(value)  //sx
//     }, (reason) => {
//         console.log(reason)
//     })

Promise.resolve(1).then(value => console.log(value)) //1