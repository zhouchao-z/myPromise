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

