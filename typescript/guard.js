function getLength(input) {
    var str = input;
    if (str.length) {
        return str.length;
    }
    else {
        var num = input;
        return num.toString().length;
    }
}
function getLength2(input) {
    if (typeof input === 'string') {
        return input.length;
    }
    else {
        return input.toString().length;
    }
}
