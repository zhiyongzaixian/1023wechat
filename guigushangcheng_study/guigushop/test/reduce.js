// reduce 累加器
/* 
	reduce: 
		1. 返回值是累加的结果
		2. 传参：
			1. 一个参数，pre就是数组的第一项或者是上次累加的结果， next是循环遍历数组之后的每一项
			2. 两个参数， 第二个参数是累加的起始值
 
 */

let arr = [1,2,3,4,5];
// 一个参数
// let result = arr.reduce((pre, next) => {
// 	console.log(pre, next)
// 	return pre += next;
// })
// 两个参数
let result = arr.reduce((pre, next) => {
	console.log(pre, next)
	return pre += next;
}, 10)

console.log(result)
