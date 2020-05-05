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
