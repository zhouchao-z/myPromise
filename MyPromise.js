const MyPromise = (function () {
  const PENDING = 'PENGDING',
  FULFILLED = 'FULFILLED',
  REJECTED = 'REJECTED';

  class MyPromise {
    constructor(executor) {

      this.status = PENDING;
      this.value = undefined;
      this.reason = undefined;

      const resolve = (value) => {
        if(this.status === PENDING) {
          this.status = FULFILLED;
          this.vlaue = value;
        }
      }

      const reject = (reason) => {
        if(this.status === PENDING) {
          this.status = REJECTED;
          this.reason = reason;
        }
      }
      try {
        executor(resolve, reject);
      } catch(e) {
        reject(e);
      }
    }
    
    then(onFulfilled, onRejected) {
      if(this.status === FULFILLED) {
        onFulfilled(this.vlaue)
      }
      if(this.status === REJECTED) {
        onRejected(this.reason)
      }
    }
  }
  return MyPromise;
})()

module.exports = MyPromise;
