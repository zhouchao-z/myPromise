const MyPromise = require('./MyPromise');

let promise = new MyPromise((resolve, reject) => {
  // resolve(1);
  // reject(1);
  throw new Error('exception: Error')
})

promise.then(value => {
  console.log('success ' + value);
}, reason => {
  console.log('error ' + reason)
})