const Promise = require('./promise');

new Promise((resolve, reject) => {
  resolve(1);
}).then(
  (value) => {
    return new Promise((resolve2) => {
      setTimeout(() => {
        resolve2(value);
      })
    });
  },
  (reason) => {
    return `reject ${reason}`;
  }
).then(
  (value) => {
    console.log('resolve2', value);
  },
  (reason) => {
    console.log('reject2', reason);
  }
);

// new Promise((resolve, reject) => {
//   resolve(1);
// }).then(
//   (value) => {
//     throw new Error('abc');
//   },
//   (reason) => {
//     return `reject ${reason}`;
//   }
// ).catch((e) => {
//   console.log(123);
//   console.log(e);
// });

// const fetchArr = [];
// const a = new Promise((resolve) => {
//   setTimeout(() => {
//     resolve(1);
//   }, 100);
// })
// const b = new Promise((resolve) => {
//   setTimeout(() => {
//     resolve(2);
//   }, 200);
// })

// fetchArr.push(a);
// fetchArr.push(b);
// Promise.all(fetchArr).then((res) => {
//   console.log(res);
// });
