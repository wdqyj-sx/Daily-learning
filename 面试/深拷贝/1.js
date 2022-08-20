let a = {
    name: 'Jack',
    age: 18,
    hobbit: ['sing', {type: 'sports', value: 'run'}],
    score: {
        math: 'A',
    },
    run: function() {},
    walk: undefined,
    fly: NaN,
    cy: null,
    date: new Date()
}
let b = JSON.parse(JSON.stringify(a))
console.log(b)
// {
//     name: 'Jack',
//     age: 18,
//     hobbit: [ 'sing', { type: 'sports', value: 'run' } ],
//     score: { math: 'A' },
//     fly: null,
//     cy: null,
//     date: '2022-08-19T02:32:33.506Z'
//   }
  