const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  });
});

const promise2 = promise.then((value) => {
  // console.log(value);
  // return value;
  return promise2; // promise2需要根据 x 的值来改变状态， 返回的 x又是promise2本身， 造成死循环
}, (reason) => {
  console.log(reason)
});

promise2.then((value) => {
  console.log(value);
}, (reason) => {
  console.log(reason)
})