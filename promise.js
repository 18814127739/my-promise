const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class Promise {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError(`Promise resolver ${executor} is not a function`);
    }
    this.initValue();

    try {
      executor(this.resolve, this.reject);
    } catch (e) {
      // 若executor报错，直接执行reject
      this.reject(e);
    }
  }

  initValue() {
    // 初始化值
    this.value = undefined;
    this.reason = undefined;
    this.state = PENDING;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
  }

  resolve = (value) => {
    // 成功后的一系列操作（状态的改变，成功回调的执行）
    if (this.state === PENDING) {
      this.state = FULFILLED;
      this.value = value;
      this.onFulfilledCallbacks.forEach(fn => fn(this.value));
    }
  };

  reject = (reason) => {
    // 失败后的一系列操作（状态的改变，失败回调的执行）
    if (this.state === PENDING) {
      this.state = REJECTED;
      this.reason = reason;
      this.onRejectedCallbacks.forEach(fn => fn(this.reason));
    }
  };

  // 要实现链式调用，且改变了后面then的值，必须通过返回新的Promise实例
  then(onFulfilled, onRejected) {
    // 参数校验
    if (typeof onFulfilled !== 'function') {
      onFulfilled = value => value;
    }
    if (typeof onRejected !== 'function') {
      onRejected = (reason) => {
        throw reason;
      }
    }

    // 返回一个新的Promise实例
    const promise2 = new Promise((resolve, reject) => {
      if (this.state === FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            Promise.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }

      if (this.state === REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            Promise.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }

      // 当executor中含有异步操作，且resolve/reject在异步中执行时， then方法会先执行，此时this.state还是pending状态
      if (this.state === PENDING) {
        // 将成功或失败时的回调函数保存到数组中，一旦resolve/reject执行，就遍历数组来调用
        this.onFulfilledCallbacks.push((value) => {
          setTimeout(() => {
            try {
              const x = onFulfilled(value);
              Promise.resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
        this.onRejectedCallbacks.push((reason) => {
          setTimeout(() => {
            try {
              const x = onRejected(reason);
              Promise.resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    });

    return promise2;
  }
}

Promise.resolvePromise = function (promise2, x, resolve, reject) {
  // x 与 promise2相等， 抛出异常， 避免循环调用
  if (promise2 === x) {
    reject(new TypeError('Chaining cycle detected for promise'));
  }
  // 防止多次调用， 成功和失败只能调用一个
  let called = false;
  // x不等于null 且x是对象或者函数
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    // x为对象or函数时
    try {
      // A+规定，声明then = x的then方法
      const then = x.then;
      // 如果then是函数，就默认是promise了
      if (typeof then === 'function') {
        then.call(
          x,
          (value) => {
            if (called) return;
            called = true;
            // 递归解析终值
            Promise.resolvePromise(promise2, value, resolve, reject);
          },
          (reason) => {
            if (called) return;
            called = true;
            reject(reason);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      // 取then出错了就不再继续执行，直接reject
      reject(e);
    }
  } else {
    resolve(x);
  }
};

// catch方法， 挂在原型上
Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
};

// resolve方法
Promise.resolve = function (val) {
  return new Promise((resolve, reject) => {
    resolve(val)
  });
}

// reject方法
Promise.reject = function (val) {
  return new Promise((resolve, reject) => {
    reject(val)
  });
}

// all方法
Promise.all = (promises) => {
  let results = [];
  let i = 0;

  function processData(index, data, resolve) {
    results[index] = data;
    i++
    if (i === promises.length) {
      resolve(results);
    }
  }
  return new Promise((resolve, reject) => {
    for (let j = 0; j < promises.length; j++) {
      promises[j].then((data) => {
        processData(j, data, resolve);
      }, e => {
        reject(e);
      })
    }
  })
}

Promise.defer = Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}

module.exports = Promise;