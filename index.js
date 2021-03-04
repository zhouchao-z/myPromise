const MyPromise = require('./MyPromise');

let promise = new MyPromise((resolve, reject) => {
  // resolve(1);
  // reject(1);
  // throw new Error('exception: Error')
  setTimeout(() => {
    reject(1);
  }, 2000)
})

promise.then(value => {
  console.log('success1 ' + value);
}, reason => {
  console.log('error1 ' + reason)
})


promise.then(value => {
  console.log('success2 ' + value);
}, reason => {
  console.log('error2 ' + reason)
})