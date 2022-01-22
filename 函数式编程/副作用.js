//不纯的
let mini = 18
function checkAge (age) {
    return age >= mini
}

//纯的 (有硬编码，可以通过柯里化解决)

function checkAge (age) {
    let mini = 18;
    return age >= mini
}