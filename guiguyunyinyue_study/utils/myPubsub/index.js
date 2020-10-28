
let PubSub = {

};

let token = 1;

// 事件池对象
// let messagesObj = {
//   musicId: {
//     '1': func,
//     '2': func,
//     '3': func,
//   }
// };
// 事件池对象
let messagesObj = {
  // musicId: func
};
// 订阅方
// message： 消息名  data: 发布的数据
PubSub.subscribe = function(message, func){
  if ( !messagesObj.hasOwnProperty( message ) ){
    messagesObj[message] = {};
  }
  
  // 判断func是否是函数
  if(typeof func !== 'function'){
    console.log('事件的回调必须是函数');
    return;
  }
  
  messagesObj[message][token++] = func;
  
}


// 发布方
// message： 消息名  data: 发布的数据
PubSub.publish = function(message, data){
  // 之前没有订阅过此消息
  if(!messagesObj[message]){
    console.log('没有当前消息');
    return;
  }
  
  // 之前订阅过
  for(let key in messagesObj[message]){
    messagesObj[message][key](message, data);
  }
}
// let messagesObj = {
//   musicId: {
//     '1': func,
//     '2': func,
//     '3': func,
//   }
// };

// 取消订阅
PubSub.unsubscribe = function (message) {
  // messagesObj[message] = {};
  if(messagesObj[message]){
    delete messagesObj[message][token];
  }
}

export default PubSub;
