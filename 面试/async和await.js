// async function t1(){
//     let a = await "lagou"
//     console.log(a)
// }
// t1()


// function* t1(){
//     let a = yield "lagou"
//     console.log(a)
// } 
// co(t1)

// function co(generator){
//     const g = generator()
//     function handleResult(result){
//         if(result.done){
//             return Promise.resolve(result.value)
//         }
        
//         if(!(result.value instanceof Promise)){
//             result.value = Promise.resolve(result.value)
//         }
//         return result.value.then(function(data){
//             handleResult(g.next(data))
//         })
//     }

//     return handleResult(g.next())
// }

// async function t2(){
//     let a = await new Promise((resolve,reject)=>{})
//     console.log('sx')
//     console.log(a)
// }
// t2()

// async function async1(){
//     console.log('A')
//    await async2()
//     console.log('B')
// }

// async function async2(){
//     console.log('C')
// }

// console.log('D')
// setTimeout(function(){
//     console.log('F')
// },0)
// async1();
// new Promise(function(resolve){
//     console.log('G')
//     resolve()
// }).then(function(){
//     console.log('H')
// })
// console.log('I')
const p1 = () => (new Promise((resolve, reject) => {
	console.log(1);
	let p2 = new Promise((resolve, reject) => {
		console.log(2);
		const timeOut1 = setTimeout(() => {
			console.log(3);
			resolve(4);
		}, 0)
		resolve(5);
	});
	resolve(6);
	p2.then((arg) => {
		console.log(arg);
	});

}));
const timeOut2 = setTimeout(() => {
	console.log(8);
	const p3 = new Promise(reject => {
		reject(9);
	}).then(res => {
		console.log(res)
	})
}, 0)


p1().then((arg) => {
	console.log(arg);
});
console.log(10);
