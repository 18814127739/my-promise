const Promise = require('./promise');

const promise = new Promise((resolve, reject) => {
  // setTimeout(() => {
  // resolve(1);

  resolve(new Promise((resolve) => {
    resolve(1);
  }));
});

const promise2 = promise.then((value) => {
  // throw new Error('error');
  // return value;
  console.log(value);
  return new Promise((resolve) => {
    resolve(value + 1)
  });
}, (reason) => {
  console.log(reason)
});

promise2.then((value) => {
  console.log(value);
  return new Promise((resolve) => {
    resolve(new Promise((resolve) => {
      setTimeout(() => {
        resolve(value + 1);
      });
    }));
  })
}, (reason) => {
  console.log(reason)
  return 1000;
}).then((value) => {
  console.log(value);
});

// x = {}

// Object.defineProperty(x, 'then', {
//   get() {
//     const x = parseInt((Math.random() * 2));
//     if(x === 0) {
//       console.log(123);
//     } else {
//       throw new Error('err123');
//     }
//   }
// })

// console.log(x.then);