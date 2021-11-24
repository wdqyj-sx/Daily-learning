const fp = require("lodash/fp")
const f = fp.flowRight(fp.join("-"),fp.map(fp.toUpper),fp.split(' '))
console.log(f('hello world'))