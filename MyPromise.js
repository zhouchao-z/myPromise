const MyPromise = (function () {
  const PENDING = 'PENGDING',
  FULFILLED = 'FULFILLED',
  REJECTED = 'REJECTED';

  const onfulfilledCallbacks = [];
  const onrejectedCallbacks = [];

  class MyPromise {
    constructor(executor) {
      this.status = PENDING;
      this.value = undefined;
      this.reason = undefined;

      const resolve = (value) => {
        if(this.status === PENDING) {
          this.status = FULFILLED;
          this.vlaue = value;
          // 对fulfilled进行集中发布
          onfulfilledCallbacks.forEach(ful => {
            ful();
          })
        }
      }

      const reject = (reason) => {
        if(this.status === PENDING) {
          this.status = REJECTED;
          this.reason = reason;

          // 对rejected进行集中发布
          onrejectedCallbacks.forEach(rej => {
            rej();
          })
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
        onFulfilled(this.vlaue);
      }
      if(this.status === REJECTED) {
        onRejected(this.reason);
      }
      
      // 异步的情况，收集依赖
      if(this.status === PENDING) {
        onfulfilledCallbacks.push(() => {
          onFulfilled(this.vlaue);
        })
        onrejectedCallbacks.push(() => {
          onRejected(this.reason);
        })
      }
    }
  }
  return MyPromise;
})()

module.exports = MyPromise;
