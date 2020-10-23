/**
  作者: Created by zhiyongzaixian
  说明: 数据劫持代理
 
  1. 初始化: data: {key: value}
  2. 使用： this.key
*/


let data = {
  username: 'curry',
  age: 33
}

// 组件实例
let _this = {
  sex: '男'
}

_this.username = data.username;

for(let key in data){
  // console.log(key, data[key]);
  Object.defineProperty(_this, key, {
    get(){ // 获取扩展属性的时候调用
      // console.log('get()');
      return data[key];
    },
    set(newValue){ // 监视扩展属性
      console.log('set()', newValue);
      // _this.username = newValue; // 千万不要在set方法中直接修改扩展属性的值，会出现死循环
      
      // 修改数据层的数据
      data[key] = newValue;
      
      // 调用update方法 更新视图
    }
  })
}

console.log(_this);
_this.username = 'wade';

console.log(_this.username);














