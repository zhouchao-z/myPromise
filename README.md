## myPromise

### 搭建环境

> 注：为了方便测试，所有的代码，均在node环境中执行
1. npm install 
2. npm run dev 

### 各分支说明

#### 1. basic

实现了一个基础版本的promise，可以实现对状态的变更，以及对resolve和reject
**同步**处理的常规操作, 没有对executor中是**异步**的情况做处理
```js
let promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 2000)
})

promise.then(value => {
  // 此时promise的状态还是处于pending，所以没有办法触发onfulfilled和onrejected
  console.log('success1 ' + value); 
}, reason => {
  console.log('error1 ' + reason)
})
```

#### 2. async

处理了executor中是**异步**的情况，如果是异步的情况，执行到then函数的时候，
promise的状态还没有进行变更，还是处于pending，那么就无法触发相对应的onfulfilled和onrejected，
所以当是异步的情况（即：当执行then时，promise还处于pending状态）,
要收集所有的onfulfilled和onrejected。等到状态变更为fulfilled或者rejected的时候，统一发布执行。

```js
// 异步的情况，收集依赖
  if(this.status === PENDING) {
    onfulfilledCallbacks.push(() => {
      onFulfilled(this.vlaue);
    })
    onrejectedCallbacks.push(() => {
      onRejected(this.reason);
    })
  }

// 状态变更进行发布
onfulfilledCallbacks.forEach(ful => {
  ful();
})
onrejectedCallbacks.forEach(rej => {
  rej();
})
```

#### 3. chain

处理then的链式调用情况：
>  一个then必须要返回一个Promise
既然要进行链式调用，就必须要知道不断的链式调用过程中，分别是什么样的情况会走进onfulfilled或onrejected 
要通过当前then函数的返回值，来确定**之后**的then函数是调用onfulfilled还是onrejected。
所以之后的工作，全部放到研究返回值上， 对应到代码上就是resolvePromise这个函数

成功的条件(调用then后，返回一个成功状态的Promise，已供下次then使用)：
- 返回一个合法的JavaScript值，(包含undefeind, null)
- 返回一个带有成功状态的Promise 

> 这里使用的是原生promise，方便做测试
```js
let promise = new Promise((resolve, reject) => {
  resolve(2);
})
promise.then(value => {
  // 返回一个带有成功状态的Promise, 所以接下来的then函数中会调用onfulfilled
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(value);
    }, 0)
  })
}, reason => {
  console.log('reject1 ' + reason)
}).then((value) => {
  console.log('promsie: ' + value); //promsie: 2
  return value; // 返回一个合法的JavaScript值， 所以接下来的then函数中会调用onfulfilled
}, (reason) => {
  console.log('reject2 ' + reason);
}).then((value) => {
  console.log('javascript: ' + value); //javascript: 2
})
```

失败的条件(调用then后，返回一个失败状态的Promise，已供下次then使用)：
- then函数中抛出异常
- 返回一个带有失败状态的Promise

```js
let promise = new Promise((resolve, reject) => {
  resolve(2);
})
promise.then(value => {
  // 返回一个带有失败状态的Promise， 所以接下来的then函数中会调用onrejected
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(value);
    }, 0)
  })
}, reason => {
  console.log('reject1 ' + reason)
}).then((value) => {
  console.log('promsie: ' + value); 
}, (reason) => {
  console.log('reject2: ' + reason); // reject2: 2
  throw new Error('Exception: ' + reason); // 抛出异常，所以接下来的then函数中会调用onrejected
}).then((value) => {
  console.log('javascript: ' + value); 
}, (reason) => {
  console.log('抛出异常：' + reason); // 抛出异常：Error: Exception: 2
})
```



最后是关于Promise相关静态方法的实现，由于比较简单，看代码即可！


