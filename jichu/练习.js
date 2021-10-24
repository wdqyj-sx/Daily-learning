var a = 1;
function fn (m) {
    console.log('fn')
}
function fn (n) {
    console.log('new_fn')
}

function a () {
    console.log('fn_a')
}

console.log(a)
fn(1)
var fn = 'var_fn'
console.log(fn)