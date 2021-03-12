const MyPromise = (() => {
  const PENDING = 'PENDING',
    REJECTED = 'REJECTED',
    FULFILLED = 'FULFILLED';

  class MyPromise {
    constructor(executor) {
      this.status = PENDING;
      this.value = undefined;
      this.reason = undefined;

      this.onrejectedCallbacks = [];
      this.onfulfilledCallbacks = [];

      const resolve = (value) => {
        if(this.status === PENDING) {
          this.status = FULFILLED;
          this.value = value;

          // 发布
          this.onfulfilledCallbacks.forEach(ful => {
            ful();
          })
        }
      }

      const reject = (reason) => {
        if(this.status === PENDING) {
          this.status = REJECTED;
          this.reason = reason;

          // 发布
          this.onrejectedCallbacks.forEach(rej => {
            rej();
          })
        }
      }
      try {
        executor(resolve, reject);
      } catch (e) {
        reject(e);
      }

    }

    then(onfulfilled, onrejected) {
      onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : value => value;
      onrejected = typeof onrejected === 'function' ? onrejected : (reason) => { throw reason }
      let promise2 = new MyPromise((resolve, reject) => {
        if(this.status === FULFILLED) {
          setTimeout(() => {
            try {
              let x = onfulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e);
            }
          }, 0)
        }
  
        if(this.status === REJECTED) {
          setTimeout(() => {
            try {
              let x = onrejected(this.reason);
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e);
            }
          }, 0)
        }
  
        if(this.status === PENDING) {
          // 收集依赖  订阅
          this.onfulfilledCallbacks.push(() => {
            try {
              let x = onfulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e);
            }
          })
          this.onrejectedCallbacks.push(() => {
            try {
              let x = onrejected(this.reason);
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e);
            }
          })
        }
      }) 

      return promise2;
    }

    catch(onrejected) {
      return this.then(null, onrejected);
    }

    static resolve(value) {
      return new MyPromise((resolve, reject) => {
        resolve(value);
      })
    }

    static reject(reason) {
      return new MyPromise((resolve, reject) => {
        reject(reason);
      })
    }

    static race(promiseArr) {
      return new MyPromise((resolve, reject) => {
        promiseArr.forEach(pro => {
          pro.then(value => resolve(value), reason => reject(reason))
        })
      })
    }

    static all(promiseArr) {
      return new MyPromise((resolve, reject) => {
        let result = [];
        let len = promiseArr.length - 1;
        promiseArr.forEach((pro, index) => {
          pro.then(value => {
            result.push(value);
            if(len === index) {
              resolve(result);
            }
          }, reason => {
            reject(reason);
          })

        })
      })
    }
  }

  // 研究返回值
  function resolvePromise(promise2, x, resolve, reject) {
    if(promise2 === x) {
      reject(new TypeError('Chaining cycle detected for MyPromise #<MyPromise>'));
    }
    if((typeof x === 'object' && x !== null) || typeof x === 'function') {
      try {
        let then = x.then;
        if(typeof then === 'function') {
          then.call(x, (y) => {
            resolve(y);
          }, (r) => {
            reject(r);
          })
        } else {
          resolve(x);
        }
      } catch (e) {
        reject(e);
      }
    } else {
      resolve(x);
    }
  }

  

  return MyPromise;


})()

module.exports = MyPromise;