function* read () {
    console.log(1)
    var a = yield 1
    console.log('a:', a)
    var b = yield 2
    console.log('b:', b)
    yield 3
}

let it = read()

it.next('sx1') //第一次无输出
it.next('sx2') //第二次输出 a:sx2
it.next('sx3')