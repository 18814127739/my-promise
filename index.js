// 1. index.js 进行原生的Promise演示
// 2. promise.js 自定义的promise
// 3. test.js 对promise.js进行测试
// 4. 开发过程结合 Promise/A+ 规范

new Promise((resolve, reject) => {
  resolve(1);
  reject(2);
}).then(
  (value) => {
    return Promise.resolve('123');
  },
  (reason) => {
    console.log(reason);
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

// const fetchArr = [];
// const a = () => new Promise((resolve) => {
//   setTimeout(() => {
//     resolve(1);
//   }, 100);
// })
// const b = () => new Promise((resolve) => {
//   setTimeout(() => {
//     resolve(2);
//   }, 200);
// })

// fetchArr.push(a());
// fetchArr.push(b());
// Promise.all(fetchArr).then((res) => {
//   console.log(res);
// });
