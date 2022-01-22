const fp = require("lodash/fp")


// hello world => H_W

const f = fp.flowRight(fp.join('-'), fp.map(fp.flowRight(fp.toUpper,fp.first)), fp.split(" "))
console.log(f('hello world'))