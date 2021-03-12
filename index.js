const MyPromise = require('./MyPromise');
let promise = new MyPromise((resolve, reject) => {
  resolve(1);
}).then(value => {
  console.log('success', value);
  throw Error(0);
}, reason => {
  console.log('error', reason);
}).then(value => {
  console.log('success2', value);
}, reason => {
  console.log('error2', reason);
})

















