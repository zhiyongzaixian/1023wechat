// toString

let arr = [1,2,3,4];
console.log(arr.toString()); // 1,2,3,4

// [object 数据类型] ---> Object.prototype.toString()
console.log(Object.prototype.toString.call(arr).slice(8, -1));
let num = 123;
console.log(Object.prototype.toString.call(num).slice(8, -1));
